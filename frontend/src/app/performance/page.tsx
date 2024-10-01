import React from "react";
import dynamic from "next/dynamic";
import FooterComponent from "@/components/FooterComponent";
const SimplePerfComponent = dynamic(
  () => import("@/components/performance/SimplePerfComponent"),
  { ssr: false },
);

const AreaChartComponent = dynamic(
  () => import("@/components/performance/AreaChartComponent"),
  { ssr: false },
);

const PerformancePage = () => {
  return (
    <>
      <div className="min-h-screen px-4 md:px-32 lg:px-72 py-16">
        <div className="bg-white">
          <SimplePerfComponent />
        </div>
        <br />
        <div className="bg-white">
          <AreaChartComponent />
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default PerformancePage;
