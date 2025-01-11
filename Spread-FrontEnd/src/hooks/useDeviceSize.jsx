import { useState, useEffect } from "react";

function useDeviceSize(breakpoint = 640) {
  const [isDeviceSize, setIsDeviceSize] = useState(
    window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDeviceSize(window.innerWidth <= breakpoint);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isDeviceSize;
}

export default useDeviceSize;
