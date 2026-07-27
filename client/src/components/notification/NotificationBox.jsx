import React, { lazy, Suspense, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNotification } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

import Ibutton from "../buttons/Ibutton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import notificationApi from "../../services/notificationApi";
const NotificationItem = lazy(() => import("./NotificationItem"));
import {
  setNotificationState,
  setNotificationStatePush,
} from "../../store/slices/notificationSlice";
import Spinner from "../loaders/Spinner";
import useSocket from "../../hooks/useSocket";

function NotificationBox() {
  const { openNotification } = useSelector((state) => state.ui);
  const { notificationState } = useSelector((state) => state.notification);
  const Icon = useIcons();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { fetchNotifications, markAllRead } = notificationApi();

  const { data: notificationData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (notificationData) {
      dispatch(setNotificationState(notificationData));
    }
  }, [notificationData, dispatch]);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (newNotification) => {
      dispatch(setNotificationStatePush(newNotification));
      queryClient.invalidateQueries(["unreadNotificationsCount"]);
    };

    socket.on("notification", handleNewNotification);
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket, dispatch, queryClient]);

  const handeClick = useCallback((e) => {
    e.stopPropagation();
    dispatch(setOpenNotification());
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadNotificationsCount"]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={handeClick}
      className={`${
        openNotification ? "pointer-events-auto" : "pointer-events-none"
      } fixed top-0 left-0 right-0 bottom-0 w-full h-full z-30 bg-opacity-0 border-inherit`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transition-all duration-150 ${
          openNotification
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        } flex flex-col justify-start items-start gap-4 sm:w-[22rem] sm:h-1/2 w-full h-full p-4 bg-light dark:bg-daccent border border-[#e7dfd8] dark:border-[#262626] shadow-xl sm:rounded-2xl absolute sm:right-40 right-0 sm:top-[4.3rem] top-[3.1rem] overflow-y-auto`}
      >
        <div className="sticky top-0 flex justify-between items-center w-full pb-3 z-10 bg-light dark:bg-daccent border-b border-[#e7dfd8] dark:border-[#262626]">
          <div className="flex items-center gap-2 font-semibold">
            {Icon["bellFi"]}
            <span>Notifications</span>
          </div>
          <div className="flex items-center gap-3">
            {notificationState?.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-500 hover:underline"
              >
                Mark all read
              </button>
            )}
            <Ibutton className="text-xl sm:hidden" action={handeClick}>
              {Icon["close"]}
            </Ibutton>
          </div>
        </div>
        <Suspense
          fallback={<Spinner className={"w-5 h-5 bg-black dark:bg-white"} />}
        >
          <div className="flex flex-col gap-2 w-full">
            {notificationState?.map((notify) => (
              <NotificationItem
                key={notify.id}
                data={notify}
                onClickItem={() => dispatch(setOpenNotification())}
              />
            ))}
            {notificationState?.length === 0 && !isLoading && (
              <div className="flex flex-col justify-center items-center py-10 w-full gap-2">
                <span className="text-3xl text-gray-400">
                  {Icon["bellFi"]}
                </span>
                <span className="text-xs text-gray-400">
                  No notifications yet
                </span>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default NotificationBox;
