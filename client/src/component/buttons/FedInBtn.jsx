import React from "react";

function FedInBtn({ action, className, children, ...props }) {
  return (
    <button
      onClick={action}
      className={`${className} flex items-center justify-self-auto gap-1 duration-100 border-inherit opacity-50 hover:opacity-100`}
      {...props}
    >
      {children}
    </button>
  );
}

export default FedInBtn;
