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
        openNotification ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      } fixed inset-0 z-50 w-full h-full bg-black/40 backdrop-blur-xs transition-opacity duration-200`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transition-all duration-200 ${
          openNotification
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        } flex flex-col justify-start items-start gap-3 w-full sm:w-[22rem] max-h-[82vh] sm:max-h-[30rem] p-4 spread-card border border-stone-200 dark:border-stone-800 shadow-2xl rounded-b-3xl sm:rounded-3xl absolute right-0 sm:right-12 lg:right-24 top-[3.8rem] overflow-y-auto z-50`}
      >
        <div className="sticky top-0 flex justify-between items-center w-full pb-3 z-10 bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
            {Icon["bellFi"]}
            <span>Notifications</span>
          </div>
          <div className="flex items-center gap-3">
            {notificationState?.some((n) => !n.read) && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <Ibutton className="text-xl sm:hidden cursor-pointer" action={handeClick}>
              {Icon["close"]}
            </Ibutton>
          </div>
        </div>
        <Suspense
          fallback={<Spinner className={"w-5 h-5 text-stone-900 dark:text-stone-100"} />}
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
                <span className="text-3xl text-stone-400">
                  {Icon["bellFi"]}
                </span>
                <span className="text-xs text-stone-400 font-medium">
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
