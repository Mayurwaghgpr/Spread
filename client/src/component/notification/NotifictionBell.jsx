import React, { useCallback } from "react";
import { BsBell } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setOpenNotification } from "../../redux/slices/uiSlice";
import Ibutton from "../buttons/Ibutton";
import useIcons from "../../hooks/useIcons";

const NotifictionBell = ({ isNotfiy = false, className }) => {
  const dispatch = useDispatch();
  const handeClick = useCallback(() => {
    dispatch(setOpenNotification());
  }, []);
  const icons = useIcons();

  return (
    <Ibutton action={handeClick} className={`${className} relative `}>
      {icons["bellO"]}
      {isNotfiy && (
        <span className="absolute top-0 flex h-3 w-3 -right-1">
          <span className="animate-ping absolute inline-flex h-[6px] w-[6px] rounded-full bg-slate-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-slate-500"></span>
        </span>
      )}
    </Ibutton>
  );
};

export default NotifictionBell;
