import React from "react";

function Ibutton({ action, className, children }) {
  return (
    <button
      className={`${className} flex items-center justify-self-auto gap-2 hover:bg-black dark:hover:bg-opacity-50 dark:hover:bg-white hover:bg-opacity-[0.06] duration-200 border-inherit `}
      onClick={action}
    >
      {children}
    </button>
  );
}

export default Ibutton;
