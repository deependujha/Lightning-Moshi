import os
import litserve as ls

class HTTPLitAPI(ls.LitAPI):
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
            yield {"output": out}

if __name__ == "__main__":
    api = HTTPLitAPI()
    server = ls.LitServer(api, accelerator="auto", workers_per_device=5, stream=True) # 5 workers per device, as no CPU-bound tasks
    server.run(port=8000, num_api_servers=os.cpu_count(), generate_client_file=False)
