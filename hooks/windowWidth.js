import React, { useEffect, useState } from "react";

export const useWindowWide = () => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);

  return width;
};
