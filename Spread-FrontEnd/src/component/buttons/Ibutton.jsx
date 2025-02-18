import React from "react";

function Ibutton({ action, className, innerText }) {
  return (
    <div className={`${className} rounded-full  p-1`}>
      <button
        className=" flex justify-center items-center w-full h-full   "
        onClick={action}
      >
        {innerText}
      </button>
    </div>
  );
}

export default Ibutton;
