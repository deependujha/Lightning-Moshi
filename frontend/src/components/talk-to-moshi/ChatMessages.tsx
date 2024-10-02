"use client";
import React from "react";
import ChatBoxComponent from "@/components/talk-to-moshi/ChatBoxComponent";
import { Pangolin } from "next/font/google";
import { TypewriterComponent } from "./TypeWriterComponenet";

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
    <div className="" style={{ maxHeight: "90vh", overflowY: "scroll" }}>
      <div
        className={`py-8 text-xl underline text-center text-pink-800 ${pangolin.className}`}
        style={{ fontSize: "40px" }}
      >
        Constitution GPT
      </div>
      {messages.map((m, index) => {
        return (
          <div
            key={index}
            className={`chatBox flex my-3 ${
              m.sender === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <ChatBoxComponent message={m.message} sender={m.sender} />
          </div>
        );
      })}
      {loading && (
        <div
          className="text-pink-500 text-center py-4"
          style={{ height: "60px" }}
          ref={myRef}
        >
          <TypewriterComponent />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
