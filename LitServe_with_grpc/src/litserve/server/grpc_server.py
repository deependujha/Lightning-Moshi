# Copyright The Lightning AI team.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import asyncio
import json
import logging
import multiprocessing as mp
import sys
import threading
import time
import types
import uuid
import grpc
import warnings
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from queue import Empty
from typing import Dict, Optional, Sequence, Tuple, Union, List

from litserve import LitAPI
from litserve.callbacks.base import CallbackRunner, Callback, EventTypes
from litserve.connector import _Connector
from litserve.loggers import Logger, _LoggerConnector
from litserve.loops import inference_worker
from litserve.utils import LitAPIStatus, load_and_raise

mp.allow_connection_pickling()

try:
    import uvloop

    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

except ImportError:
    print("uvloop is not installed. Falling back to the default asyncio event loop.")

logger = logging.getLogger(__name__)

async def response_queue_to_buffer(
    response_queue: mp.Queue,
    response_buffer: Dict[str, Union[Tuple[deque, asyncio.Event], asyncio.Event]],
    stream: bool,
    threadpool: ThreadPoolExecutor,
):
    loop = asyncio.get_running_loop()
    if stream:
        while True:
            try:
                uid, response = await loop.run_in_executor(threadpool, response_queue.get)
            except Empty:
                await asyncio.sleep(0.0001)
                continue
            stream_response_buffer, event = response_buffer[uid]
            stream_response_buffer.append(response)
            event.set()

    else:
        while True:
            uid, response = await loop.run_in_executor(threadpool, response_queue.get)
            event = response_buffer.pop(uid)
            response_buffer[uid] = response
            event.set()


class GRPCServer:
    def __init__(
        self,
        lit_api: LitAPI,
        litserve_pb2: types.ModuleType,
        litserve_pb2_grpc: types.ModuleType,
        enable_reflection: bool = True,
        accelerator: str = "auto",
        devices: Union[str, int] = "auto",
        workers_per_device: int = 1,
        timeout: Union[float, bool] = 30,
        max_batch_size: int = 1,
        batch_timeout: float = 0.0,
        stream: bool = False,
        max_payload_size=None,
        callbacks: Optional[Union[List[Callback], Callback]] = None,
        loggers: Optional[Union[Logger, List[Logger]]] = None,
    ):
        if batch_timeout > timeout and timeout not in (False, -1):
            raise ValueError("batch_timeout must be less than timeout")
        if max_batch_size <= 0:
            raise ValueError("max_batch_size must be greater than 0")

        # Check if the batch and unbatch methods are overridden in the lit_api instance
        batch_overridden = lit_api.batch.__code__ is not LitAPI.batch.__code__
        unbatch_overridden = lit_api.unbatch.__code__ is not LitAPI.unbatch.__code__

        if batch_overridden and unbatch_overridden and max_batch_size == 1:
            warnings.warn(
                "The LitServer has both batch and unbatch methods implemented, "
                "but the max_batch_size parameter was not set."
            )

        lit_api.stream = stream
        lit_api.request_timeout = timeout

        # self.app = grpc.aio.server(ThreadPoolExecutor(max_workers=10))
        # self.app.response_queue_id = None
        self.response_queue_id = None
        self.response_buffer = {}
        self.enable_reflection = enable_reflection

        self.litserve_pb2 = litserve_pb2
        self.litserve_pb2_grpc = litserve_pb2_grpc

        self._logger_connector = _LoggerConnector(self, loggers)
        self.logger_queue = None
        self.lit_api = lit_api
        self.workers_per_device = workers_per_device
        self.max_batch_size = max_batch_size
        self.batch_timeout = batch_timeout
        self.stream = stream
        self.max_payload_size = max_payload_size
        self._connector = _Connector(accelerator=accelerator, devices=devices)
        self._callback_runner = CallbackRunner(callbacks)

        accelerator = self._connector.accelerator
        devices = self._connector.devices
        if accelerator == "cpu":
            self.devices = [accelerator]
        elif accelerator in ["cuda", "mps"]:
            device_list = devices
            if isinstance(devices, int):
                device_list = range(devices)
            self.devices = [self.device_identifiers(accelerator, device) for device in device_list]

        self.inference_workers = self.devices * self.workers_per_device
        # self.register_endpoints()

    def register_endpoints(self, app):
        """Register endpoint routes for the grpc server."""
        self._callback_runner.trigger_event(EventTypes.ON_SERVER_START, litserver=self)

        if not hasattr(self.litserve_pb2_grpc, "LitServeServicer"):
            raise RuntimeError(
                "The LitServeServicer class is not defined in the litserve_pb2_grpc module. "
                "Please make sure to define the `LitServe` Service in the proto file."
            )

        if not hasattr(self.litserve_pb2_grpc, "add_LitServeServicer_to_server"):
            raise RuntimeError(
                "`add_LitServeServicer_to_server` function is not defined in the litserve_pb2_grpc module. "
                "Please make sure to define the `LitServe` Service in the proto file."
            )

        _self = self

        class LitServeServicer(self.litserve_pb2_grpc.LitServeServicer):
            async def Predict(self, request, context):  # noqa: N802
                response_queue_id = app[0].response_queue_id

                uid = uuid.uuid4()
                event = asyncio.Event()
                _self.response_buffer[uid] = event
                logger.info(f"Received request uid={uid}")

                _self.request_queue.put_nowait((response_queue_id, uid, time.monotonic(), request))

                await event.wait()
                response, status = _self.response_buffer.pop(uid)
                if status == LitAPIStatus.ERROR:
                    load_and_raise(response)
                if(type(response) is not Dict):
                    return response
                rsp = _self.litserve_pb2.Response()
                for field in _self.litserve_pb2.Response.DESCRIPTOR.fields:
                    if response.get(field.name):
                        setattr(rsp, field.name, response[field.name])
                return rsp

        class LitServeServicerStream(self.litserve_pb2_grpc.LitServeServicer):
            async def Predict(self, request, context):  # noqa: N802
                response_queue_id = app[0].response_queue_id

                uid = uuid.uuid4()
                event = asyncio.Event()
                q = deque()
                _self.response_buffer[uid] = (q, event)

                _self.request_queue.put((response_queue_id, uid, time.monotonic(), request))

                async for value in _self.data_streamer(q, data_available=event):
                    rsp = _self.litserve_pb2.Response()
                    if(type(value) is str):
                        value = json.loads(value)
                    for field in _self.litserve_pb2.Response.DESCRIPTOR.fields:
                        if value.get(field.name):
                            setattr(rsp, field.name, value[field.name])
                    yield rsp

        if self.stream:
            self.litserve_pb2_grpc.add_LitServeServicer_to_server(LitServeServicerStream(), app[0])
        else:
            self.litserve_pb2_grpc.add_LitServeServicer_to_server(LitServeServicer(), app[0])

        if self.enable_reflection:
            try:
                from grpc_reflection.v1alpha import reflection

                service_names = (
                    self.litserve_pb2.DESCRIPTOR.services_by_name["LitServe"].full_name,
                    reflection.SERVICE_NAME,
                )
                reflection.enable_server_reflection(service_names, app[0])
            except ImportError:
                logger.warning(
                    "gRPC reflection is not installed. Please install it to enable reflection.",
                    "Run: pip install grpcio-reflection"
                )



    async def data_streamer(self, q: deque, data_available: asyncio.Event, send_status: bool = False):
        while True:
            await data_available.wait()
            while len(q) > 0:
                data, status = q.popleft()
                if status == LitAPIStatus.FINISH_STREAMING:
                    return

                if status == LitAPIStatus.ERROR:
                    logger.error(
                        "Error occurred while streaming outputs from the inference worker. "
                        "Please check the above traceback."
                    )
                    if send_status:
                        yield data, status
                    return
                if send_status:
                    yield data, status
                else:
                    yield data
            data_available.clear()

    def run(
        self,
        port: Union[str, int] = 8000,
        num_api_servers: Optional[int] = None,
        log_level: str = "info",
        api_server_worker_type: Optional[str] = None,
        **kwargs,
    ):
        port_msg = f"port must be a value from 1024 to 65535 but got {port}"
        try:
            port = int(port)
        except ValueError:
            raise ValueError(port_msg)

        if not (1024 <= port <= 65535):
            raise ValueError(port_msg)

        # config = uvicorn.Config(app=self.app, host="0.0.0.0", port=port, log_level=log_level, **kwargs)
        # sockets = [config.bind_socket()]

        if num_api_servers is None:
            num_api_servers = len(self.inference_workers)

        if num_api_servers < 1:
            raise ValueError("num_api_servers must be greater than 0")

        if sys.platform == "win32":
            warnings.warn(
                "Windows does not support forking. Using threads" " api_server_worker_type will be set to 'thread'"
            )
            api_server_worker_type = "thread"
        elif api_server_worker_type is None:
            api_server_worker_type = "process"

        manager, litserve_workers = self.launch_inference_worker(num_api_servers)

        try:
            servers = self._start_server(port, num_api_servers, log_level, api_server_worker_type, **kwargs)
            print(f"Grpc Server is available at http://0.0.0.0:{port}")
            print(f"Reflection is {'enabled' if self.enable_reflection else 'disabled'}.")

            for s in servers:
                s.join()
        except Exception as e:
            print("exception occurred:", e)
        finally:
            print("Shutting down LitServe")
            for w in litserve_workers:
                w.terminate()
                w.join()
            manager.shutdown()

    def _start_server(self, port, num_grpc_servers, log_level, grpc_worker_type, **kwargs):
        servers = []
        for response_queue_id in range(num_grpc_servers):
            # self.app.response_queue_id = response_queue_id

            # app = copy.deepcopy(self.app)

            # Get the current event loop
            if grpc_worker_type == "process":
                ctx = mp.get_context("fork")
                w = ctx.Process(target=self.start_grpc_server_in_process, args=(
                    response_queue_id, port)
                )
            elif grpc_worker_type == "thread":
                w = threading.Thread(target=self.start_grpc_server_in_process, args=(
                    response_queue_id, port
                ))
            else:
                raise ValueError("Invalid value for api_server_worker_type. Must be 'process' or 'thread'")
            w.start()
            servers.append(w)
        return servers


    def launch_inference_worker(self, num_grpc_servers: int):
        manager = mp.Manager()
        self.workers_setup_status = manager.dict()
        self.request_queue = manager.Queue()
        if self._logger_connector._loggers:
            self.logger_queue = manager.Queue()

        self._logger_connector.run(self)

        self.response_queues = [manager.Queue() for _ in range(num_grpc_servers)]

        process_list = []
        for worker_id, device in enumerate(self.inference_workers):
            if len(device) == 1:
                device = device[0]

            self.workers_setup_status[worker_id] = False

            ctx = mp.get_context("spawn")
            process = ctx.Process(
                target=inference_worker,
                args=(
                    self.lit_api,
                    None,
                    device,
                    worker_id,
                    self.request_queue,
                    self.response_queues,
                    self.max_batch_size,
                    self.batch_timeout,
                    self.stream,
                    self.workers_setup_status,
                    self._callback_runner,
                    'grpc',
                ),
            )
            process.start()
            process_list.append(process)
        return manager, process_list

    @asynccontextmanager
    async def lifespan(self, app: grpc.server):
        loop = asyncio.get_running_loop()

        if not hasattr(self, "response_queues") or not self.response_queues:
            raise RuntimeError(
                "Response queues have not been initialized. "
                "Please make sure to call the 'launch_inference_worker' method of "
                "the LitServer class to initialize the response queues."
            )

        response_queue = self.response_queues[app.response_queue_id]
        response_executor = ThreadPoolExecutor(max_workers=len(self.inference_workers))
        future = response_queue_to_buffer(response_queue, self.response_buffer, self.stream, response_executor)
        task = loop.create_task(future)

        yield

        self._callback_runner.trigger_event(EventTypes.ON_SERVER_END, litserver=self)
        task.cancel()
        logger.debug("Shutting down response queue to buffer task")

    def device_identifiers(self, accelerator, device):
        if isinstance(device, Sequence):
            return [f"{accelerator}:{el}" for el in device]
        return [f"{accelerator}:{device}"]

    async def _start_grpc_servers(self,response_queue_id, port):
        app = grpc.aio.server(ThreadPoolExecutor(max_workers=10))
        app.response_queue_id = response_queue_id
        self.register_endpoints([app])
        app.add_insecure_port(f"[::]:{port}")
        # Run the server with the lifespan context manager
        async with self.lifespan(app):
            await app.start()
            await app.wait_for_termination()

    def start_grpc_server_in_process(self, response_queue_id, port):
        # This synchronous function wraps the async function in asyncio.run()sudo lsof -i -P -n | grep LISTEN
        asyncio.run(self._start_grpc_servers(response_queue_id, port))
