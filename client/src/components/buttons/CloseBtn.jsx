import React from "react";
import useIcons from "../../hooks/useIcons";

function CloseBtn({ className, ...props }) {
  const { close } = useIcons();

  return (
    <button
      className={` relative ${className} text-3xl transition-all duration-200 rounded-full p-1 hover:bg-gray-500/20 before:absolute before:bottom-0  before:opacity-0 hover:before:opacity-100  before:right-0 before:top-10 before:w-fit before:h-fit before:text-xs before:content-['close'] `}
      {...props}
    >
      {close}
    </button>
  );
}

export default CloseBtn;
