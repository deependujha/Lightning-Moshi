"use client";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Slider } from "@nextui-org/react";
import Image from "next/image";

type Props = {
  sender: "user" | "bot";
  audio: string;
};

const UserAudioBoxCSS =
  "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
const BotAudioBoxCSS = "bg-gradient-to-r from-cyan-500 to-blue-500";

const AudioPlayerComponent = ({ sender, audio }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex justify-center items-center gap-2 py-3">
      {sender === "bot" && (
        <Image
          src="/icons/assistant.png"
          width={40}
          height={40}
          alt="assistant"
        />
      )}
      <div
        className={`flex items-center gap-2  rounded-3xl px-4 py-1 ${sender === "user" ? UserAudioBoxCSS : BotAudioBoxCSS}`}
      >
        {isPlaying ? (
          <button onClick={() => setIsPlaying(false)}>
            <FontAwesomeIcon
              icon={faPause}
              style={{ color: "#ffffff" }}
              className="h-5 w-5"
            />
          </button>
        ) : (
          <button onClick={() => setIsPlaying(true)}>
            <FontAwesomeIcon
              icon={faPlay}
              style={{ color: "#ffffff" }}
              className="h-5 w-5"
            />
          </button>
        )}
        <div className="text-white px-1 text-center py-4">0:00</div>
        <SliderComponent />
        <div className="text-white px-1 text-center py-4">0:20</div>
      </div>
      {sender === "user" && (
        <Image src="/icons/user.png" width={40} height={40} alt="assistant" />
      )}
    </div>
  );
};

export default AudioPlayerComponent;

const SliderComponent = () => {
  return (
    <Slider
      size="sm"
      step={0.1}
      color="foreground"
      maxValue={10}
      minValue={0}
      defaultValue={0}
      className="w-[40vw] md:w-[30vw]"
      aria-labelledby="slider-label"
    />
  );
};
