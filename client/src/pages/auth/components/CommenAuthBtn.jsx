import React from "react";

function CommenAuthBtn({ children, className, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`bg-black text-white dark:bg-white dark:text-black p-3 w-full rounded-lg transition-opacity ${
        className
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default CommenAuthBtn;
