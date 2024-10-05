import os
import litserve as ls
import random

class HTTPLitAPI(ls.LitAPI):
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
        # Mimic continuous streaming of audio/video data as a stream of bytes
        for chunk in output:
            yield chunk

if __name__ == "__main__":
    api = HTTPLitAPI()
    server = ls.LitServer(api, accelerator="auto", workers_per_device=5, stream=True)
    server.run(port=8000, num_api_servers=os.cpu_count(), generate_client_file=False)
