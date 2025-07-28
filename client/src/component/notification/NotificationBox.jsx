import React, { lazy, Suspense, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNotification } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

import Ibutton from "../buttons/Ibutton";
import { useQuery } from "react-query";
import notificationApi from "../../services/notificationApi";
const NotifictionItem = lazy(() => import("./NotificationItem"));
import { setNotificationState } from "../../store/slices/notificationSlice";
import NotificationItem from "./NotificationItem";
import Spinner from "../loaders/Spinner";

function NotificationBox() {
  const { openNotification } = useSelector((state) => state.ui);
  const { notificationState } = useSelector((state) => state.notification);
  const Icon = useIcons();
  const dispatch = useDispatch();
  const { fetchNotifications } = notificationApi();
  const { isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    onSuccess: (data) => {
      dispatch(setNotificationState(data));
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: 10000,
    retry: 1,
  });

  const handeClick = useCallback((e) => {
    e.stopPropagation();
    dispatch(setOpenNotification());
  }, []);

  return (
    <div
      onClick={handeClick}
      className={` ${openNotification ? " pointer-events-auto " : "pointer-events-none"} fixed top-0 left-0 right-0 bottom-0 w-full  h-full z-30  bg-opacity-0 border-inherit`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transition-all duration-150 border-inherit ${openNotification ? " scale-100 opacity-100 pointer-events-auto " : "scale-95 opacity-0 pointer-events-none"} flex flex-col justify-start items-start gap-5 sm:w-[20rem] sm:h-1/2  w-full h-full p-5 pt-0 bg-light dark:bg-dark border shadow-sm sm:rounded-lg absolute sm:right-40 right-0 sm:top-[4.3rem] top-[3.1rem]  overflow-y-auto`}
      >
        <div className=" sticky top-0 flex justify-between items-center gap-3 w-full p-2 z-10 bg-inherit   ">
          <div className="flex justify-start items-center gap-3 ">
            {Icon["bellFi"]}
            <h1>notification</h1>
          </div>
          <Ibutton className="text-xl sm:hidden" action={handeClick}>
            {Icon["close"]}
          </Ibutton>
        </div>
        <Suspense
          fallback={<Spinner className={"w-5 h-5 bg-black dark:bg-white"} />}
        >
          {notificationState?.map((notify) => (
            <NotificationItem key={notify.id} data={notify} />
          ))}
          {notificationState?.length === 0 && !isLoading && (
            <div className="flex justify-center items-center w-full h-full">
              <span className="w-10 h-10 text-gray-500 dark:text-gray-400">
                {Icon["bellFi"]}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                No notifications
              </span>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default NotificationBox;
