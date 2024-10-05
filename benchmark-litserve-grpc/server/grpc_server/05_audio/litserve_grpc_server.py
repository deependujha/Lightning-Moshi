import os
# server.py
import litserve as ls
import litserve_pb2
import litserve_pb2_grpc

class GRPCLitAPI(ls.LitAPI):
    def setup(self, device):
        ...

    def decode_request(self, request):
        audio = request.field1
        save_path = "nature.mp3"  # You can change the path and filename as needed
        with open(save_path, "wb") as f:
            f.write(audio)  # Write the image content to disk
        return request 

    def predict(self, x):
        return x

    def encode_response(self, output):
        return output

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
    )
    server.run(port=8500, num_api_servers=os.cpu_count(), generate_client_file=False)
