"use client";
import React from "react";
import ChatBoxComponent from "@/components/talk-to-moshi/ChatBoxComponent";
import { Pangolin } from "next/font/google";
import Typewriter from "typewriter-effect";
import AudioPlayerComponent from "./AudioPlayerComponent";

const pangolin = Pangolin({
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

type MsgType = {
  message: string;
  sender: "user" | "bot";
};

type Props = {
  messages: MsgType[];
  myRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
};

const ChatMessages = ({ messages, myRef, loading }: Props) => {
  return (
    <div className="mx-2" style={{ maxHeight: "90vh", overflowY: "scroll" }}>
      {messages.map((m, index) => {
        return (
          <div
            key={index}
            className={`chatBox flex my-3 ${
              m.sender === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <AudioPlayerComponent sender={m.sender} />
          </div>
        );
      })}
      {loading && (
        <div
          className="text-pink-500 text-center py-4"
          style={{ height: "60px" }}
          ref={myRef}
        >
          <WaitingForAIResponse msg="Please wait, Moshi is generating response..." />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

const WaitingForAIResponse = ({ msg }: { msg: string }) => {
  return (
    <div className="text-white px-3 text-center pt-4 pb-[13vh]">
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
