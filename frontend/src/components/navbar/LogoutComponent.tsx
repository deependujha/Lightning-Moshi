"use client";
import React from "react";
import { Button } from "@nextui-org/react";

type LogoutComponentProps = {
  changeLoginStatus: (status: boolean) => void;
};

const LogoutComponent = ({ changeLoginStatus }: LogoutComponentProps) => {
  const logoutHandler = () => {
    console.log(`logout handler called!`);
    changeLoginStatus(false);
  };

  return (
    <div className="">
      <Button color="danger" variant="bordered" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutComponent;
