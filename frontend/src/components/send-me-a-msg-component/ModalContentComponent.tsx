"use client";
import React, { useState } from "react";
import {
  useModal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal";

type ModalContentComponentProps = {
  Notify: (success: boolean) => void;
};

function ModalContentComponent({ Notify }: ModalContentComponentProps) {
  const { setOpen } = useModal();
  const [message, setMessage] = useState("");

  const msgSendHandler = () => {
    console.log(`message sent: ${message}`);
    setMessage("");
    setOpen(false);
    Notify(message.length > 0);
  };

  return (
    <ModalBody className="mx-4 border-r-large">
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
          rows={10}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></textarea>

        <div className="pt-10 flex flex-wrap gap-x-4 items-start justify-start max-w-sm mx-auto">
          <div className="flex  items-center justify-center">
            <PullRequestIcon className="mr-1 text-white h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              45+ pull requests
            </span>
          </div>
          <div className="flex items-center justify-center">
            <IssueIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              20+ issues
            </span>
          </div>
          <div className="flex items-center justify-center">
            <GitHubIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              100+ repository
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

const GitHubIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#ffffff"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
};
const PullRequestIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="#ffffff"
      width="800px"
      height="800px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>pull request icon</title>
      <path d="M192,96a64,64,0,1,0-96,55.39V360.61a64,64,0,1,0,64,0V151.39A64,64,0,0,0,192,96ZM128,64A32,32,0,1,1,96,96,32,32,0,0,1,128,64Zm0,384a32,32,0,1,1,32-32A32,32,0,0,1,128,448Z" />
      <path d="M416,360.61V156a92.1,92.1,0,0,0-92-92H304V32a16,16,0,0,0-27.31-11.31l-64,64a16,16,0,0,0,0,22.62l64,64A16,16,0,0,0,304,160V128h20a28,28,0,0,1,28,28V360.61a64,64,0,1,0,64,0ZM384,448a32,32,0,1,1,32-32A32,32,0,0,1,384,448Z" />
    </svg>
  );
};

const IssueIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="#ffffff"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      width="800px"
      height="800px"
      viewBox="0 0 45.311 45.311"
      className={className}
    >
      <g>
        <path
          d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656
		c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635
		C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001
		c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0
		c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578
		c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0
		c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29
		c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z"
        />
      </g>
    </svg>
  );
};

export default ModalContentComponent;
