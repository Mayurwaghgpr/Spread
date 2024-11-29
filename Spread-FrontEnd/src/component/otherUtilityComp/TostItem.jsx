import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast, removeAllToast } from "../../redux/slices/uiSlice";

function ToastItem({ ToastContent }) {
  const dispatch = useDispatch();
  const timerRef = useRef({});
  const { ToastState } = useSelector((state) => state.ui);
  const [rmToastId, setrmToastId] = useState();

  useEffect(() => {
    timerRef.current[ToastContent.id] = setTimeout(() => {
      setrmToastId(ToastContent.id);
    }, 1800);
    // Set timeout for each toast
    timerRef.current[ToastContent.id] = setTimeout(() => {
      dispatch(removeToast(ToastContent.id));
    }, 2300);
    // Clean up timeout when component unmounts or when toast is dismissed
    return () => {
      clearTimeout(timerRef.current[ToastContent.id]);
    };
  }, [dispatch, ToastContent.id]);

  const status =
    ToastContent.type === "success"
      ? "bg-green-300"
      : ToastContent.type === "error"
        ? "bg-red-300"
        : ToastContent.type === "warning"
          ? "bg-yellow-300"
          : "bg-sky-300";

  return (
    <span
      className={`${rmToastId === ToastContent.id && " animate-slide-out-left"} " animate-slide-in-left" transition-all duration-300 ease-in-out pointer-events-auto ${status} shadow-xl flex flex-col rounded-lg w-fit`}
    >
      <div className="flex p-4">
        <div className="break-words flex">
          <p className="word-break">{ToastContent?.message}</p>
        </div>
        <button
          onClick={() => {
            clearTimeout(timerRef.current[ToastContent.id]);
            dispatch(removeToast(ToastContent.id));
          }}
          className="ml-4"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    </span>
  );
}

export default memo(ToastItem);
