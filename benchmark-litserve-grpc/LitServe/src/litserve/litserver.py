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
import types
from typing import Callable, Optional, Union, List


from litserve import LitAPI
from litserve.callbacks.base import Callback
from litserve.loggers import Logger
from litserve.specs.base import LitSpec
from litserve.server import HTTPServer, GRPCServer


class LitServer:
    def __init__(
        self,
        lit_api: LitAPI,
        accelerator: str = "auto",
        devices: Union[str, int] = "auto",
        workers_per_device: int = 1,
        timeout: Union[float, bool] = 30,
        max_batch_size: int = 1,
        batch_timeout: float = 0.0,
        api_path: str = "/predict",
        stream: bool = False,
        spec: Optional[LitSpec] = None,
        max_payload_size=None,
        callbacks: Optional[Union[List[Callback], Callback]] = None,
        middlewares: Optional[list[Union[Callable, tuple[Callable, dict]]]] = None,
        loggers: Optional[Union[Logger, List[Logger]]] = None,
        protocol: str = "http",
        litserve_pb2: types.ModuleType = None,
        litserve_pb2_grpc: types.ModuleType = None,
        enable_reflection: bool = True,
    ):
        if protocol not in ["http", "grpc", "both"]:
            raise ValueError("protocol must be one of: ['http', 'grpc', 'both']")

        self.protocol = protocol

        if protocol == "http":
            self.server = HTTPServer(
                lit_api,
                accelerator,
                devices,
                workers_per_device,
                timeout,
                max_batch_size,
                batch_timeout,
                api_path,
                stream,
                spec,
                max_payload_size,
                callbacks,
                middlewares,
                loggers,
            )
        elif protocol == "grpc":
            self.server = GRPCServer(
                lit_api=lit_api,
                litserve_pb2=litserve_pb2,
                litserve_pb2_grpc=litserve_pb2_grpc,
                enable_reflection=enable_reflection,
                accelerator=accelerator,
                devices=devices,
                workers_per_device=workers_per_device,
                timeout=timeout,
                max_batch_size=max_batch_size,
                batch_timeout=batch_timeout,
                stream=stream,
                max_payload_size=max_payload_size,
                callbacks=callbacks,
                loggers=loggers,
            )
        else:
            raise ValueError("GRPC server is not implemented yet")

    def run(
        self,
        port: Union[str, int, List[str], List[int]] = 8000,
        num_api_servers: Optional[int] = None,
        log_level: str = "info",
        generate_client_file: bool = True,
        api_server_worker_type: Optional[str] = None,
        **kwargs,
    ):
        if self.protocol == "http":
            self.server.run(port, num_api_servers, log_level, generate_client_file, api_server_worker_type, **kwargs)
        else:
            self.server.run(port, num_api_servers, log_level, api_server_worker_type, **kwargs)
