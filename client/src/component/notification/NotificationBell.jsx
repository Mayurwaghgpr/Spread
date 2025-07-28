import React, { useCallback } from "react";

import { useDispatch } from "react-redux";
import { setOpenNotification } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";
import FedInBtn from "../buttons/FedInBtn";
import notificationApi from "../../services/notificationApi";
import { useQuery, useQueryClient } from "react-query";
import useSocket from "../../hooks/useSocket";
import { useEffect } from "react";

const NotificationBell = ({ isNotfiy = false, className }) => {
  const dispatch = useDispatch();
  const handeClick = useCallback(() => {
    dispatch(setOpenNotification());
  }, []);
  const icons = useIcons();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { fetchUnreadCount } = notificationApi();
  // Fetch unread notifications count
  const { data } = useQuery({
    queryFn: fetchUnreadCount,
    queryKey: ["unreadNotificationsCount"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries(["unreadNotificationsCount"]);
    queryClient.invalidateQueries(["notifications"]);
  }, [dispatch]);
  //Listening for realtime notification
  useEffect(() => {
    socket?.on("notification", invalidateQuery);

    return () => {
      socket?.off("notification", invalidateQuery);
    };
  }, [socket, invalidateQuery]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {" "}
      {Boolean(data?.count) && (
        <span className="absolute top-0 flex h-3 w-3 -right-1">
          <span className="animate-ping absolute inline-flex h-[6px] w-[6px] rounded-full bg-slate-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-slate-500"></span>
        </span>
      )}
      <FedInBtn action={handeClick} className={` relative `}>
        {icons["bellO"]}
      </FedInBtn>
    </div>
  );
};

export default NotificationBell;
