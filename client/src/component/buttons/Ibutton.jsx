import React from "react";

function Ibutton({ action, className, children, ...props }) {
  return (
    <button
      className={`${className} flex items-center justify-self-auto gap-1 duration-100 border-inherit`}
      onClick={action}
      {...props}
    >
      {children}
    </button>
  );
}

export default Ibutton;
