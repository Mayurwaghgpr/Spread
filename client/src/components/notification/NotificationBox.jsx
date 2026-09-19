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
        } flex flex-col justify-start items-start w-full sm:w-[23rem] max-h-[85vh] sm:max-h-[32rem] bg-white dark:bg-[#121215] border border-stone-200 dark:border-stone-800 shadow-2xl rounded-b-3xl sm:rounded-2xl overflow-hidden absolute right-0 sm:right-12 lg:right-24 top-[3.8rem] z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center w-full px-4 py-3 shrink-0 bg-white dark:bg-[#121215] border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
            <span className="text-base text-stone-800 dark:text-stone-200">{Icon["bellFi"]}</span>
            <span>Notifications</span>
            {notificationState?.some((n) => !n.read) && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {notificationState?.some((n) => !n.read) && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={handeClick}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-base"
              aria-label="Close notifications"
            >
              {Icon["close"]}
            </button>
          </div>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto w-full p-2.5 space-y-1.5">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-12">
                <Spinner className={"w-5 h-5 text-stone-900 dark:text-stone-100"} />
              </div>
            }
          >
            {notificationState?.map((notify) => (
              <NotificationItem
                key={notify.id}
                data={notify}
                onClickItem={() => dispatch(setOpenNotification())}
              />
            ))}
            {notificationState?.length === 0 && !isLoading && (
              <div className="flex flex-col justify-center items-center py-12 w-full gap-2 text-stone-400">
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/60 text-xl text-stone-400 dark:text-stone-500">
                  {Icon["bellO"]}
                </div>
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                  No notifications yet
                </span>
                <span className="text-[11px] text-stone-400 dark:text-stone-500 text-center max-w-[200px]">
                  When someone likes, comments, or follows you, updates will show up here.
                </span>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default NotificationBox;
