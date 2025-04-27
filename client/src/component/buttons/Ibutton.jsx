import React from "react";

function Ibutton({ action, className, children, ...props }) {
  return (
    <button
      className={` flex items-center justify-self-auto gap-1  opacity-100 hover:opacity-50 duration-100 border-inherit ${className}`}
      onClick={action}
      {...props}
    >
      {children}
    </button>
  );
}

export default Ibutton;
