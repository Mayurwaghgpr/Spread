import React from "react";

function Ibutton({ action, className, children }) {
  return (
    <button
      className={`flex items-centerjustify-center gap-2 hover:bg-black dark:hover:bg-opacity-20 dark:hover:bg-white hover:bg-opacity-10 duration-200 border-inherit ${className}`}
      onClick={action}
    >
      {children}
    </button>
  );
}

export default Ibutton;
