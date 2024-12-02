import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast, removeAllToast } from "../../redux/slices/uiSlice";

function ToastItem({ ToastContent }) {
  const dispatch = useDispatch();
  const timerRefBf = useRef({});
  const timerRefAf = useRef({});
  const { ToastState } = useSelector((state) => state.ui);
  const [rmToastId, setrmToastId] = useState([]);

  useEffect(() => {
    timerRefBf.current[ToastContent.id] = setTimeout(() => {
      setrmToastId((prv) => [...prv, ToastContent.id]);
    }, 2000);
    // Set timeout for each toast
    timerRefAf.current[ToastContent.id] = setTimeout(() => {
      dispatch(removeToast(ToastContent.id));
    }, 3000);
    // Clean up timeout when component unmounts or when toast is dismissed
    return () => {
      clearTimeout(timerRefAf.current[ToastContent.id]);
      clearTimeout(timerRefBf.current[ToastContent.id]);
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
      className={`${rmToastId?.includes(ToastContent.id) ? "animate-slide-out-left" : "animate-slide-in-left"} transition-all duration-300 ease-in-out pointer-events-auto ${status} shadow-xl flex flex-col rounded-lg w-fit`}
    >
      <div className="flex p-4">
        <div className="break-words flex">
          <p className="word-break">{ToastContent?.message}</p>
        </div>
        <button
          onClick={() => {
            clearTimeout(timerRefBf.current[ToastContent.id]);
            clearTimeout(timerRefAf.current[ToastContent.id]);
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
