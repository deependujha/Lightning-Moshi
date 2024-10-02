"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";

const Notification = () => {
  const curr_url = usePathname();
  const [notificationVisible, setNotificationVisible] = useState(
    curr_url !== "/app",
  );
  const handleNotificationClose = () => {
    console.log(`notification closed`);
    setNotificationVisible(false);
  };
  if (!notificationVisible) {
    return null;
  }
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-800 to-pink-500 flex justify-center">
      <div className="text-center text-white text-sm my-1">
        <span className="font-bold">New! LitServe with gRPC </span>
        <span>support is now available.</span>
      </div>
      <button className="ml-7 my-1 z-40" onClick={handleNotificationClose}>
        <Image
          src="/images/close-notification.png"
          width={15}
          height={15}
          alt="cross-button"
          className="cursor-pointer"
        />
      </button>
    </div>
  );
};

export default Notification;
