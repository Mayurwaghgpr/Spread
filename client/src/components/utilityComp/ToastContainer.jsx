import React, { memo } from "react";

import { useSelector, useDispatch } from "react-redux";
import TostItem from "./TostItem";
import { createPortal } from "react-dom";
function ToastContainer() {
  const { ToastState } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return createPortal(
    <div
      className={`fixed flex flex-col items-center justify-center -space-y-16 space-x-5  bg-none pointer-events-none z-50 bottom-20 sm:right-20 transition-all duration-300 ease-linear px-3   `}
    >
      {ToastState?.map((content, idx, arr) => {
        return (
          <TostItem
            style={{
              zIndex: ToastState.length - idx,
              opacity: Math.max(1 - idx * 0.5, 0),
              transform: `translateY(${idx * 5}px)`,
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
            arr={arr}
            key={content.id}
            ToastContent={content}
          />
        );
      })}
    </div>,
    document.getElementById("portal")
  );
}

export default memo(ToastContainer);
