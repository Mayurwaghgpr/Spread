import React, { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../../redux/slices/uiSlice";
import Ibutton from "../buttons/Ibutton";
import useIcons from "../../hooks/useIcons";

function ToastItem({ ToastContent, arr, ...props }) {
  const dispatch = useDispatch();
  const timerRefAf = useRef({});
  const { ToastState } = useSelector((state) => state.ui);
  const icons = useIcons();
  useEffect(() => {
    if (timerRefAf.current[ToastContent.id])
      clearTimeout(timerRefAf.current[ToastContent.id]);
    // Set timeout for each toast
    timerRefAf.current[ToastContent.id] = setTimeout(() => {
      dispatch(removeToast(ToastContent.id));
    }, 5000);

    // Cleanup timeout when unmounting
    return () => {
      if (timerRefAf.current[ToastContent.id]) {
        clearTimeout(timerRefAf.current[ToastContent.id]);
        delete timerRefAf.current[ToastContent.id]; // Clean reference
      }
    };
  }, [dispatch, ToastContent.id, ToastContent.count]);

  return (
    <div
      {...props}
      className={` flex flex-col items-center justify-center shadow-lg animate-slide-in-bottom p-4 bg-white dark:text-black transition-all duration-300 ease-in-out pointer-events-auto rounded-lg`}
    >
      <div className="flex justify-between items-center gap-4 text-nowrap  w-full">
        <div className="flex justify-center items-center gap-2 text-sm">
          {icons[ToastContent.type]}
          <p className="">{ToastContent?.message}</p>
        </div>
        <Ibutton
          className={"  text-xl font-medium rounded-full"}
          action={() => {
            dispatch(removeToast(ToastContent.id));
          }}
        >
          {icons["close"]}
        </Ibutton>
      </div>
      <div className=" w-full text-end opacity-40 ">
        <small>
          {arr.length} of {ToastContent.count}
        </small>
      </div>
    </div>
  );
}

export default memo(ToastItem);
