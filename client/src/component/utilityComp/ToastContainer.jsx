import React, { memo } from "react";

import { useSelector, useDispatch } from "react-redux";
import TostItem from "./TostItem";
import { createPortal } from "react-dom";
function ToastContainer() {
  const { ToastState } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return createPortal(
    <div
      className={`fixed   bg-none  pointer-events-none z-50 bottom-10 sm:left-20 transition-all duration-300 ease-linear flex flex-col gap-3 px-3 min-w-[50px]   `}
    >
      {ToastState?.map((content, idx) => {
        return <TostItem key={idx} ToastContent={content} />;
      })}
    </div>,
    document.getElementById("portal")
  );
}

export default memo(ToastContainer);
