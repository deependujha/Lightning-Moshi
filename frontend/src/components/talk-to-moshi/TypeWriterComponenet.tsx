"use client";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
export function TypewriterComponent() {
  // Please wait. AI is generating response...
  const words = [
    {
      text: "Please",
    },
    {
      text: "wait,",
    },
    {
      text: "Moshi",
      className: "text-pink-500 dark:text-pink-500",
    },
    {
      text: "is",
    },
    {
      text: "generating",
    },
    {
      text: "response...",
    },
  ];
  return (
    <div className="">
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}
