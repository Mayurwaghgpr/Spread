import React from "react";

function Ibutton({ action, className, children }) {
  return (
    <button
      className={` flex items-center justify-self-auto gap-1  opacity-50 hover:opacity-100 duration-100 border-inherit ${className}`}
      onClick={action}
    >
      {children}
    </button>
  );
}

export default Ibutton;
