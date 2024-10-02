"use client";
import React from "react";
import Typewriter from "typewriter-effect";
import AudioPlayerComponent from "./AudioPlayerComponent";

export type MsgType = {
  message: string;
  sender: "user" | "bot";
  duration: number;
};

type Props = {
  msg: MsgType[];
  myRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
};

const AudioMessages = ({ msg, myRef, loading }: Props) => {
  return (
    <div className="mx-2" style={{ maxHeight: "90vh", overflowY: "scroll" }}>
      {msg.map((m, index) => {
        return (
          <div
            key={index}
            className={`chatBox flex my-3 ${
              m.sender === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <AudioPlayerComponent
              audio={m.message}
              sender={m.sender}
              duration={m.duration}
            />
          </div>
        );
      })}
      {loading && (
        <div className="text-pink-500 text-center py-4">
          <WaitingForAIResponse msg="Please wait, Moshi is generating response..." />
        </div>
      )}
      <div className="" ref={myRef} style={{ height: "20vh" }}></div>
    </div>
  );
};

export default AudioMessages;

const WaitingForAIResponse = ({ msg }: { msg: string }) => {
  return (
    <div className="text-white px-3 text-center pt-4">
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
