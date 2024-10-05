# server.py
import torchaudio
import litserve as ls
import litserve_pb2
import litserve_pb2_grpc
from moshi_codes import MoshiClass

# (STEP 1) - DEFINE THE API (compound AI system)
class GRPCLitAPI(ls.LitAPI):
    def setup(self, device):
        self.model = MoshiClass()
        print("setup model done")

    def decode_request(self, request):
        wf, sr = torchaudio.load(request["content"].file)
        return self.model.preprocess_waveform(wf, sr)

    def predict(self, x):
        audio_buffer = self.model.get_model_response(x)
        return audio_buffer


    def encode_response(self, output):
        return {
            "audio": output
        }

# (STEP 2) - START THE SERVER
if __name__ == "__main__":
    server = ls.LitServer(
        GRPCLitAPI(),
        litserve_pb2=litserve_pb2,
        litserve_pb2_grpc=litserve_pb2_grpc,
        enable_reflection=True,
        protocol='grpc',
    )
    server.run(port=8000)

