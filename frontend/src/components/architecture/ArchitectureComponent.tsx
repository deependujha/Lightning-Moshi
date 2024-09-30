"use client";
import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

const ArchitectureComponent = () => {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="">
      <Accordion variant="bordered">
        {[...Array(10)].map((_, i) => (
          <AccordionItem
            key={i}
            aria-label={`Accordion ${i + 1}`}
            subtitle="Press to expand"
            title={`Accordion ${i + 1}`}
          >
            <div>{defaultContent}</div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ArchitectureComponent;
