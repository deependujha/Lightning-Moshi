"use client";
import React, { useRef, useState } from "react";
import ChatMessages from "@/components/talk-to-moshi/ChatMessages";
import InputComponent from "@/components/talk-to-moshi/InputComponent";
import MainLandingComponent from "@/components/talk-to-moshi/MainLandingComponent";
import { GridBackground } from "@/components/ui/GridBackground";

type MsgType = {
  message: string;
  sender: "user" | "bot";
};

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

  return (
    <div className="min-h-screen">
        <GridBackground >
      <div className="h-[90vh] grid-bg-radial">
        {messages.length === 0 ? (
          <div className="flex h-[90vh] justify-center items-center">
              <MainLandingComponent />
          </div>
        ) : (
          <div>
            <ChatMessages messages={messages} myRef={myRef} loading={loading} />
          </div>
        )}
      </div>
      </GridBackground>

      <div className="flex pl-[40vw] lg:pl-[45vw] items-center fixed bottom-5">
        <InputComponent addNewMsg={addNewMsg} />
      </div>
    </div>
  );
};

export default AppPage;
