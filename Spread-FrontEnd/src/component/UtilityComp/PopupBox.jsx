import React from "react";

export const PopupBox = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black">
      <div className=" bg-[#fff9f3] dark:bg-black w-1/3 h-1/3 border border-inherit rounded-lg ">
        {children}
      </div>
    </div>
  );
};
