import React from "react";

function BgFedInBtn({ action, className, children, ...props }) {
  return (
    <button
      onClick={action}
      className={` flex items-center justify-self-auto gap-1 duration-100 border-inherit hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10   ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default BgFedInBtn;
