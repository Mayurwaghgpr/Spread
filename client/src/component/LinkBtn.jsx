import React from "react";
import { Link } from "react-router-dom";

function LinkBtn({ className, stub, action, children }) {
  return (
    <Link
      onClick={action}
      to={stub}
      inputMode
      className={`flex justify-center items-center gap-2 transition-all duration-200 font-light bg-inherit w-full h-full text-inherit border-inherit ${className}`}
    >
      {children}
    </Link>
  );
}

export default LinkBtn;
