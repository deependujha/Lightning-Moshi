from huggingface_hub import hf_hub_download
import torch
import io
import torch.nn.functional as F
import torchaudio
import torchaudio.transforms as T
from moshi.models import loaders, LMGen



class MoshiClass:
    def __init__(self):
        mimi_weight = hf_hub_download(loaders.DEFAULT_REPO, loaders.MIMI_NAME)
        self.mimi = loaders.get_mimi(mimi_weight, device='cuda')
        self.mimi.set_num_codebooks(8)  # up to 32 for mimi, but limited to 8 for moshi.

        self.mimi.cuda()
        moshi_weight = hf_hub_download(loaders.DEFAULT_REPO, loaders.MOSHI_NAME)
        self.moshi = loaders.get_moshi_lm(moshi_weight, device='cuda')
        self.lm_gen = LMGen(self.moshi, temp=0.8, temp_text=0.7)  # this handles sampling params etc.

        # Streaming encoding - this breaks the waveform into frames for streaming.
        self.frame_size = int(self.mimi.sample_rate / self.mimi.frame_rate)

    def pad_wf(self, wf):
        no_of_chunks = len(wf[0][0]) // 24000
        if len(wf[0][0])%24000!=0:
            no_of_chunks+=1

        padded_tensor = F.pad(wf, (0, 24000*no_of_chunks - wf.size(2)), mode='constant', value=0)

        return padded_tensor


    def preprocess_waveform(self, wf, sr):
        # resample wf with the model's expected sample-rate (24000)
        # Define the resampling transform
        resample_transform = T.Resample(orig_freq=sr, new_freq=24000)
        resampled_waveform = resample_transform(wf)
        mono_waveform = torch.mean(resampled_waveform, dim=0, keepdim=True) # if multiple channels, take their mean
        mono_waveform.unsqueeze_(0) # add a batch dimension

        mono_waveform = self.pad_wf(mono_waveform)

        # move mono_waveform to cuda
        mono_waveform = mono_waveform.to("cuda")
        return mono_waveform


    def get_model_response(self, wf): # waveform, sample_rate
        # resample wf with the model's expected sample-rate (24000)
        with torch.no_grad():
            all_codes = []
            with self.mimi.streaming(batch_size=1):
                for offset in range(0, wf.shape[-1], self.frame_size):
                    frame = wf[:, :, offset: offset + self.frame_size]
                    if (frame.shape[-1] != self.frame_size):
                        frame = F.pad(frame, (0, self.frame_size - frame.shape[-1]), mode='constant', value=0)
                    codes = self.mimi.encode(frame)
                    assert codes.shape[-1] == 1, codes.shape
                    all_codes.append(codes)
        out_wav_chunks = []
        # Now we will stream over both Moshi I/O, and decode on the fly with Mimi.
        with torch.no_grad(), self.lm_gen.streaming(1), self.mimi.streaming(1):
            for idx, code in enumerate(all_codes):
                tokens_out = self.lm_gen.step(code.cuda())
                # tokens_out is [B, 1 + 8, 1], with tokens_out[:, 1] representing the text token.
                if tokens_out is not None:
                    wav_chunk = self.mimi.decode(tokens_out[:, 1:])
                    out_wav_chunks.append(wav_chunk)
            
            # extensind model output
            code = torch.zeros((1,1,self.frame_size), device="cuda")
            code = self.mimi.encode(code)
            for i in range(100):
                tokens_out = self.lm_gen.step(code.cuda())
                # tokens_out is [B, 1 + 8, 1], with tokens_out[:, 1] representing the text token.
                if tokens_out is not None:
                    wav_chunk = self.mimi.decode(tokens_out[:, 1:])
                    # if wav_chunk is all zeros, then the model is not generating anything
                    if (wav_chunk.sum() != 0):
                        out_wav_chunks.append(wav_chunk)
                    else:
                        break
                else:
                    break

        out_wav = torch.cat(out_wav_chunks, dim=-1)
        moshi_response = out_wav.squeeze(0)
        # filename = f"final_grpc_output_+{str(time.time())}.wav"
        # torchaudio.save(filename, moshi_response.cpu(), sample_rate=self.mimi.sample_rate, backend="soundfile")
        # Squeeze the tensor to remove single-dimensional entries
        moshi_response = out_wav.squeeze(0)
        
        # Create a BytesIO buffer to hold the audio data in memory
        audio_buffer = io.BytesIO()
        
        # Save the audio to the buffer instead of a file
        torchaudio.save(audio_buffer, moshi_response.cpu(), sample_rate=24000, backend="soundfile")
        
        # Set the buffer's position to the beginning so it can be read from the start
        audio_buffer.seek(0)
        return audio_buffer
