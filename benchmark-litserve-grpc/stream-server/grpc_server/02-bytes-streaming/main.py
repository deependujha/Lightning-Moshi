import os
import litserve as ls
import litserve_pb2
import litserve_pb2_grpc
import random

class GRPCLitAPI(ls.LitAPI):
    def setup(self, device):
        ...

    def decode_request(self, request):
        return request 

    def predict(self, x):
        # Simulate audio/video streaming by returning a dummy bytes generator
        # Here, it generates random bytes as a dummy audio/video stream.
        chunk_size = 1024*10  # Size of each byte chunk (10 KB per chunk)
        total_chunks = 1000  # Total number of chunks to simulate (for example, 10 MB of data)

        for _ in range(total_chunks):
            # Generate a chunk of random bytes (mimicking streaming audio or video data)
            dummy_chunk = bytes([random.randint(0, 255) for _ in range(chunk_size)])
            yield dummy_chunk

    def encode_response(self, output):
        for out in output:
            yield {"message": out}
            # yield out

if __name__ == "__main__":
    api = GRPCLitAPI()
    server = ls.LitServer(
        api,
        workers_per_device=5,
        accelerator="auto",
        litserve_pb2=litserve_pb2,
        litserve_pb2_grpc=litserve_pb2_grpc,
        enable_reflection=True,
        protocol='grpc',
        stream=True,
    )
    server.run(port=8000, num_api_servers=os.cpu_count(), generate_client_file=False)
