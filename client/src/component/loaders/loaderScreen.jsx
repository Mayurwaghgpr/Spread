import Spinner from "./Spinner";
// import { createPortal } from "react-dom";

function LoaderScreen({ message }) {
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col gap-4 justify-center items-center   w-full h-screen">
      <h1 className=" text-xl "> {message}</h1>
      <Spinner className={"bg-black dark:bg-white w-10 p-1"} />
    </div>
  );
}

export default LoaderScreen;
