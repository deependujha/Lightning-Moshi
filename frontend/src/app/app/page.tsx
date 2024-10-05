"use client";
import React, { useRef, useState } from "react";
import AudioMessages, {
  MsgType,
} from "@/components/talk-to-moshi/AudioMessages";
import InputComponent from "@/components/talk-to-moshi/InputComponent";
import MainLandingComponent from "@/components/talk-to-moshi/MainLandingComponent";
import { GridBackground } from "@/components/ui/GridBackground";

const AppPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([] as MsgType[]);
  const myRef = useRef<HTMLDivElement>(null);

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  // const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedUrlList, setRecordedUrlList] = useState<MsgType[]>([]);
  const recordingStartTime = useRef<number>(0);

  const startRecording = async () => {
    try {
      console.log("start recording");
      // Ensure navigator.mediaDevices is available and typed
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        sendAudioBlob(recordedBlob);
        const url = URL.createObjectURL(recordedBlob);
        const endTime = new Date().valueOf();
        const differenceInSeconds = Math.ceil(
          (endTime - recordingStartTime.current) / 1000,
        );
        setRecordedUrlList([
          ...(recordedUrlList || []),
          { message: url, sender: "user", duration: differenceInSeconds },
        ]);
        console.log("Recorded audio:", recordedBlob);
        chunks.current = []; // Reset chunks after processing
      };

      mediaRecorder.current.start();
      recordingStartTime.current = new Date().valueOf();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    console.log("stop recording");
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStream.current = null; // Reset media stream
    }
    if (myRef.current !== null) {
      console.log("scroll to bottom");
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const addNewMsg = async (
    msg: string,
    sender: "user" | "bot",
    duration: number,
  ) => {
    setMessages((prev) => [
      ...prev,
      { message: msg, sender: sender, duration: duration },
    ]);
    setTimeout(() => {
      if (myRef.current !== null) {
        myRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
    setLoading(true);
    // axios
    //   .post("/api/", {
    //     prompt: msg,
    //   })
    //   .then((aiResponse: any) => {
    //     console.log(`aiResponse`, aiResponse.data);
    //     // return;
    //     aiResponse = aiResponse.data.answer;
    //     setMessages((prev) => [
    //       ...prev,
    //       { message: aiResponse, sender: "bot" },
    //     ]);
    //     setLoading(false);
    //   })
    //   .catch((err: Error) => {
    //     console.log("err", err);
    //     setMessages((prev) => [
    //       ...prev,
    //       { message: "An error occurred 🥲", sender: "bot" },
    //     ]);
    //     setLoading(false);
    //     alert(err.message || "An error occurred while making API request");
    //   });
  };

  const sendAudioBlob = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav"); // Append the blob to FormData, with a filename

    try {
      const response = await fetch("http://localhost:8080/getResponse", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Audio blob uploaded successfully");
      } else {
        console.error("Error uploading the audio blob");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-[90vh]">
      <GridBackground>
        <div className="h-[85vh] grid-bg-radial">
          {recordedUrlList.length === 0 ? (
            <div className="flex flex-col h-[90vh] justify-center items-center">
              <MainLandingComponent />
            </div>
          ) : (
            <div className="z-10">
              <AudioMessages
                msg={recordedUrlList}
                myRef={myRef}
                loading={loading}
              />
            </div>
          )}
        </div>
      </GridBackground>

      <div className="flex pl-[40vw] lg:pl-[45vw] items-center fixed bottom-0 h-[10vh] z-20 w-full bg-black">
        <InputComponent
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>
    </div>
  );
};

export default AppPage;
