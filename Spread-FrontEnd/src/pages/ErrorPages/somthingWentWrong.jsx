import React from "react";

function SomthingWentWrong({ cause, message }) {
  return (
    <div className="fixed z-10 bg-[#fff9f3] left-0 right-0 bottom-0 top-0 flex justify-center items-center text-center ">
      <h1 className=" text-2xl">...Oops something went wrong</h1>
      {/* <p className="text">Error Code</p> */}
    </div>
  );
}

export default SomthingWentWrong;
