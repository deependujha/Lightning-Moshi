import React from "react";
import { Pangolin } from "next/font/google";

const pangolin = Pangolin({
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const MainLandingComponent = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div
          className={`h-[80vh] flex items-center justify-center text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 ${pangolin.className}`}
          style={{ fontSize: "40px" }}
        >
          Lightning Moshi ⚡
        </div>
      </div>
    </div>
  );
};

export default MainLandingComponent;
