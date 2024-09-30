import React from "react";
import ModalContentComponent from "@/components/send-me-a-msg-component/ModalContentComponent";
import SendMeAMsgBtnComponent from "@/components/send-me-a-msg-component/SendMeAMsgBtn";
import { Modal } from "@/components/ui/animated-modal";
import { BackgroundLines } from "@/components/ui/background-lines";

const SendMeAMsgPage = () => {
  return (
    <div>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <div>
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            LitServe + gRPC + moshi, <br /> Deependu Jha
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
            {`I'm a passionate core contributor to LitData (Lightning-AI), with expertise in AI,
          ML, and software development. I'm actively seeking full-time
          opportunities where I can make an impact. If you're looking for a
          dedicated developer who's ready to hit the ground running, let's
          connect.
          I'm eager and available to contribute right away!
          `}
          </p>
          <div className="flex justify-center items-center py-5">
            <Modal>
              <SendMeAMsgBtnComponent />
              <ModalContentComponent />
            </Modal>
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default SendMeAMsgPage;
