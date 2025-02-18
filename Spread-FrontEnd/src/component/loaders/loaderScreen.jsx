import React from "react";
import Spiner from "./Spinner";
import { createPortal } from "react-dom";

function LoaderScreen() {
  return createPortal(
    <div className="fixed left-0 right-0 bottom-0 top-0 flex justify-center items-center z-[1000] bg-black bg-opacity-50 w-full opacity-30  h-screen">
      <Spiner className={`w-10 h-10 border-t-black dark:border-t-white`} />
    </div>,
    document.getElementById("portal")
  );
}

export default LoaderScreen;
