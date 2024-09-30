import React from "react";

const FooterComponent = () => {
  return (
    <>
      <hr className="border-t-2 border-gray-400" />
      <div className="h-20 flex flex-col items-center justify-center">
        <div>
          Thanks for visiting website! Checkout my{" "}
          <a
            href="https://github.com/deependujha"
            className="font-bold underline text-pink-500"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
};

export default FooterComponent;
