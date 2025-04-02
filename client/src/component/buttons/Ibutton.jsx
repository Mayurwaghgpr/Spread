import React from "react";

function Ibutton({ action, className, children }) {
  return (
    <button
      className={`flex items-center  border-inherit justify-center gap-2 ${className}`}
      onClick={action}
    >
      {children}
    </button>
  );
}

export default Ibutton;
