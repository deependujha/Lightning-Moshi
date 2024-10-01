"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { Compare } from "../ui/compare";

export function ScrollCompareComponent() {
  return (
    <div className="overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                gRPC & LitServe
              </span>
            </h1>
          </>
        }
      >
        <Compare
          firstImage="/compare/litserve.svg"
          secondImage="/compare/grpc_litserve.svg"
          className="w-full h-full"
          slideMode="hover"
        />
        {/* <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        /> */}
      </ContainerScroll>
    </div>
  );
}
