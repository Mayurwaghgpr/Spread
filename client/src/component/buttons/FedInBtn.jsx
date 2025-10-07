import React from "react";

function FedInBtn({ action, className, children, ...props }) {
  return (
    <button
      onClick={action}
      className={` flex items-center justify-self-auto gap-1 duration-200 border-inherit text-slate-400 hover:text-slate-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default FedInBtn;
