import React, { useCallback } from "react";
import { BsBell } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setOpenNotification } from "../../redux/slices/uiSlice";

const NotifictionBell = ({ isNotfiy = false, className }) => {
  const dispatch = useDispatch();
  const handeClick = useCallback(() => {
    dispatch(setOpenNotification());
  }, []);

  return (
    <button onClick={handeClick} className={`${className} relative`}>
      <BsBell />
      {isNotfiy && (
        <span className="absolute top-0 flex h-3 w-3 -right-1">
          <span className="animate-ping absolute inline-flex h-[6px] w-[6px] rounded-full bg-slate-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-slate-500"></span>
        </span>
      )}
    </button>
  );
};

export default NotifictionBell;
