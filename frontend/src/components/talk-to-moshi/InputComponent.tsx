"use client";
import Image from "next/image";
import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { Tooltip } from "@nextui-org/react";

type Props = {
  startRecording: () => void;
  stopRecording: () => void;
};

const InputComponent = ({ startRecording, stopRecording }: Props) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecording = async (status: boolean) => {
    setIsRecording(status);
    if (status) {
      await startRecording();
    } else {
      await stopRecording();
    }
  };

  return (
    <div className="flex items-center bg-black">
      <Tooltip
        content={isRecording ? "Pause Recording" : "Start Recording"}
        className="text-black bg-violet-400"
      >
        <div>
          <button
            className="flex items-center"
            onClick={() => handleRecording(!isRecording)}
          >
            <div>
              <Image
                src={
                  isRecording
                    ? "/icons/pause-button.png"
                    : "/icons/microphone.png"
                }
                width={40}
                height={40}
                alt="microphone"
                priority={true}
              />
            </div>
            {isRecording ? (
              <div className="text-white px-3 text-center">
                <RecordingText msg="recording..." />
              </div>
            ) : (
              <div className="text-white px-3 text-center">say...</div>
            )}
          </button>
        </div>
      </Tooltip>
    </div>
  );
};

export default InputComponent;

const RecordingText = ({ msg }: { msg: string }) => {
  return (
    <div className="text-white text-center">
      <Typewriter
        onInit={(typewriter) => {
          typewriter.typeString(msg).pauseFor(800).start();
        }}
        options={{
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
        }}
      />
    </div>
  );
};
