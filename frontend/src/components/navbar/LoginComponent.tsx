"use client";
import React from "react";
import Image from "next/image";

type LoginComponentProps = {
  changeLoginStatus: (status: boolean) => void;
};

const LoginComponent = ({ changeLoginStatus }: LoginComponentProps) => {
  const loginHandler = () => {
    console.log(`login handler called!`);
    changeLoginStatus(true);
  };

  return (
    <button
      className="flex rounded-xl border-1 border-pink-400 px-4 py-2 hover:bg-gradient-to-r from-indigo-500 via-purple-800 to-pink-500 hover:text-white"
      onClick={loginHandler}
    >
      <Image src="/images/google.png" width={20} height={20} alt="google" />
      <div className="mx-2">Sign In</div>
    </button>
  );
};

export default LoginComponent;
