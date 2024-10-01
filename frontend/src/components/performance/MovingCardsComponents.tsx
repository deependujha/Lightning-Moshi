"use client";

import React from "react";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function MovingCardsComponent() {
  return (
    <div className="min-h-screen rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "You are early in your career and have already demonstrated value through your contributions. I'm looking forward to see you contributing to LitData or whatever open source project will catch your enthusiasm.",
    name: "Luca Antiga",
    title: "CTO, Lightning AI",
  },
  {
    quote: "Nice! Btw big thanks for all your great contributions to LitData!",
    name: "Sebastian Raschka",
    title: " Staff Research Engineer, Lightning AI",
  },
  {
    quote: "Oh man, you rock! I love the commitment !",
    name: "Thomas Chaton",
    title: " Staff Research Engineer, Lightning AI",
  },
];
