"use client";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef } from "react";
import { Slider } from "@nextui-org/react";
import Image from "next/image";

type Props = {
  sender: "user" | "bot";
  audio: string;
  duration: number;
};

const UserAudioBoxCSS =
  "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
const BotAudioBoxCSS = "bg-gradient-to-r from-cyan-500 to-blue-500";

const AudioPlayerComponent = ({ sender, audio, duration }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element
  const [currentTime, setCurrentTime] = useState(0); // Current time of the audio

  // Play or pause the audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        setCurrentTime(0);
        setIsPlaying(false);
        return;
      }

      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.currentTime >= duration) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  };

  // Seek audio when progress bar is dragged
  const handleSeek = (value: number | number[]) => {
    if (typeof value !== "number") {
      value = value[0];
    }
    const seekTime = value;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 py-3">
      <audio ref={audioRef} src={audio} onTimeUpdate={handleTimeUpdate} />

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
          <button onClick={togglePlayPause}>
            <FontAwesomeIcon
              icon={faPause}
              style={{ color: "#ffffff" }}
              className="h-5 w-5"
            />
          </button>
        ) : (
          <button onClick={togglePlayPause}>
            <FontAwesomeIcon
              icon={faPlay}
              style={{ color: "#ffffff" }}
              className="h-5 w-5"
            />
          </button>
        )}
        <div className="text-white px-1 text-center py-4">
          {PrettyPrintTime(Math.ceil(currentTime))}
        </div>
        <SliderComponent
          duration={duration}
          value={currentTime}
          onChange={handleSeek}
        />
        <div className="text-white px-1 text-center py-4">
          {PrettyPrintTime(duration)}
        </div>
      </div>
      {sender === "user" && (
        <Image src="/icons/user.png" width={40} height={40} alt="assistant" />
      )}
    </div>
  );
};

export default AudioPlayerComponent;

type SliderComponentProps = {
  value: number;
  onChange: (v: number | number[]) => void;
  duration: number;
};

const SliderComponent = ({
  value,
  onChange,
  duration,
}: SliderComponentProps) => {
  return (
    <Slider
      size="sm"
      step={1}
      color="foreground"
      maxValue={duration}
      minValue={0}
      defaultValue={0}
      className="w-[40vw] md:w-[30vw]"
      aria-labelledby="slider-label"
      value={value}
      onChange={onChange}
    />
  );
};

const PrettyPrintTime = (t: number) => {
  if (t >= 60) {
    return "0:59";
  }
  if (t >= 10) {
    return `0:${t}`;
  }
  return `0:0${t}`;
};
