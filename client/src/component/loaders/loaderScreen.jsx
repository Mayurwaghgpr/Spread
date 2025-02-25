import React from "react";
import Spinner from "./Spinner";
import { createPortal } from "react-dom";

function LoaderScreen({ message }) {
  return createPortal(
    <div className="fixed left-0 right-0 bottom-0 top-0 flex flex-col gap-4 justify-center items-center  z-[1000] bg-black bg-opacity-20 backdrop-blur-[2px] w-full h-screen">
      <h1 className=" text-xl "> {message}</h1>
      <Spinner className={"bg-black dark:bg-white w-10 p-1"} />
    </div>,
    document.getElementById("portal")
  );
}

export default LoaderScreen;
