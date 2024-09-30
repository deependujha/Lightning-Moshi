// import React from "react";

// const SendMeAMsgPage = () => {
//   return <div className="bg-black min-h-screen">

//   </div>;
// };

// export default SendMeAMsgPage;

"use client";
import React from "react";
import { ModalTrigger } from "@/components/ui/animated-modal";

function SendMeAMsgBtnComponent() {
  return (
    <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
      <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
        Send me a msg
      </span>
      <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
        📧
      </div>
    </ModalTrigger>
  );
}

export default SendMeAMsgBtnComponent;
