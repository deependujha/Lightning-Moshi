"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatMessages from "@/components/talk-to-moshi/ChatMessages";
import InputComponent from "@/components/talk-to-moshi/InputComponent";
import MainLandingComponent from "@/components/talk-to-moshi/MainLandingComponent";
import { GridBackground } from "@/components/ui/GridBackground";
import AudioPlayerComponent from "@/components/talk-to-moshi/AudioPlayerComponent";

type MsgType = {
  message: string;
  sender: "user" | "bot";
};

const DummyData: MsgType[] = [
  {
    message: "Hello, how are you doing today?",
    sender: "user",
  },
  {
    message: "I'm doing great, thanks for asking!",
    sender: "bot",
  },
  {
    message: "I'm doing great, thanks for asking!",
    sender: "bot",
  },
  {
    message:
      "I'm doing great, thanks for asking! I'm doing great, thanks for asking!",
    sender: "bot",
  },
  {
    message: "How are you doing today?",
    sender: "user",
  },
];

const AppPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([] as MsgType[]);
  const myRef = useRef<HTMLDivElement>(null);

  const addNewMsg = async (msg: string, sender: "user" | "bot") => {
    if (msg.trim() === "") return;
    setMessages((prev) => [...prev, { message: msg, sender: sender }]);
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
  useEffect(() => {
    DummyData.forEach((msg) => {
      addNewMsg(msg.message, msg.sender);
    });
  }, []);

  return (
    <div className="h-[90vh]">
      <GridBackground>
        <div className="h-[80vh] grid-bg-radial">
          {messages.length === 0 ? (
            <div className="flex flex-col h-[90vh] justify-center items-center">
              <MainLandingComponent />
              {/* {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="py-3">
                  <AudioPlayerComponent sender={i % 2 === 0 ? "user" : "bot"} />
                </div>
              ))} */}
            </div>
          ) : (
            <div className="z-10">
              <ChatMessages
                messages={messages}
                myRef={myRef}
                loading={loading}
              />
            </div>
          )}
        </div>
      </GridBackground>

      <div className="flex pl-[40vw] lg:pl-[45vw] items-center fixed bottom-0 h-[10vh] z-20 w-full bg-black">
        <InputComponent addNewMsg={addNewMsg} />
      </div>
    </div>
  );
};

export default AppPage;
