import ArchitectureComponent from "@/components/architecture/ArchitectureComponent";
import FooterComponent from "@/components/FooterComponent";
import React from "react";

const ArchitecturePage = () => {
  return (
    <>
      <div className="min-h-screen px-4 md:px-32 lg:px-72 py-16">
        <ArchitectureComponent />
      </div>
      <FooterComponent />
    </>
  );
};

export default ArchitecturePage;
