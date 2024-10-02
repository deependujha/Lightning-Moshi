"use client";
import Image from "next/image";
import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { Tooltip, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  addNewMsg: (msg: string, sender: "user" | "bot") => void;
};

const InputComponent = ({ addNewMsg }: Props) => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <>
      <Tooltip
        content={isRecording ? "Pause Recording" : "Start Recording"}
        className="text-black bg-violet-400"
      >
        <div>
          <button onClick={() => setIsRecording(!isRecording)}>
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
          </button>
        </div>
      </Tooltip>
      {isRecording ? (
        <RecordingText msg="recording..." />
      ) : (
        <div className="text-white px-3 text-center py-4">say something</div>
      )}
    </>
  );
};

export default InputComponent;

const RecordingText = ({ msg }: { msg: string }) => {
  return (
    <div className="text-white px-3 text-center py-4">
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
