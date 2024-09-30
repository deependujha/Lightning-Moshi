"use client";
import React, { useState } from "react";
import {
  useModal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal";

function ModalContentComponent() {
  const { setOpen } = useModal();
  const [message, setMessage] = useState("");

  const msgSendHandler = () => {
    console.log(`message sent: ${message}`);
    setMessage("");
    setOpen(false);
  };

  return (
    <ModalBody>
      <ModalContent>
        <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
          Have some kind words for{" "}
          <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
            me!
          </span>{" "}
          🤠
        </h4>

        <textarea
          id="message"
          rows={6}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          onChange={(e) => setMessage(e.target.value)}
        >
          {message}
        </textarea>

        <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
          <div className="flex  items-center justify-center">
            <PlaneIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              5 connecting flights
            </span>
          </div>
          <div className="flex items-center justify-center">
            <ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              12 hotels
            </span>
          </div>
          <div className="flex items-center justify-center">
            <VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              69 visiting spots
            </span>
          </div>
          <div className="flex  items-center justify-center">
            <FoodIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Good food everyday
            </span>
          </div>
          <div className="flex items-center justify-center">
            <MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Open Mic
            </span>
          </div>
          <div className="flex items-center justify-center">
            <ParachuteIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Paragliding
            </span>
          </div>
        </div>
      </ModalContent>
      <ModalFooter className="gap-4">
        <button
          className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28 hover:bg-gradient-to-r from-indigo-500 via-purple-800 to-pink-500 hover:font-bold hover:text-white"
          onClick={msgSendHandler}
        >
          Send
        </button>
      </ModalFooter>
    </ModalBody>
  );
}

const PlaneIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
    </svg>
  );
};

const VacationIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
      <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
      <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
      <path d="M15 9l-3 5.196" />
      <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
    </svg>
  );
};

const ElevatorIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M10 10l2 -2l2 2" />
      <path d="M10 14l2 2l2 -2" />
    </svg>
  );
};

const FoodIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
    </svg>
  );
};

const MicIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
      <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
    </svg>
  );
};

const ParachuteIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12a10 10 0 1 0 -20 0" />
      <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
      <path d="M2 12l10 10l-3.5 -10" />
      <path d="M15.5 12l-3.5 10l10 -10" />
    </svg>
  );
};

export default ModalContentComponent;
