import os
import litserve as ls
import litserve_pb2
import litserve_pb2_grpc

class GRPCLitAPI(ls.LitAPI):
    def setup(self, device):
        ...

    def decode_request(self, request):
        return request 

    def predict(self, x):
        sentence = "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        for _ in range(100):
            yield sentence

    def encode_response(self, output):
        for out in output:
            yield {"message": out}

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
