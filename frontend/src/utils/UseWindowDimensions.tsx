"use client";

import { useState, useEffect } from "react";

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({ width: window.innerWidth });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth });
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
