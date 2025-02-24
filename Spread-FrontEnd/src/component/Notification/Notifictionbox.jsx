import React, { lazy, Suspense, useCallback } from "react";
const NotifictionItem = lazy(() => import("./NotifictionItem"));
import Spinner from "../loaders/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNotification } from "../../redux/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

const notifications = [
  {
    id: 1,
    type: "like",
    message: "John liked your post.",
    timestamp: "2025-02-24T10:15:00Z",
    read: false,
    userId: 101,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    type: "comment",
    message: "Alice commented on your post: 'Great work!'",
    timestamp: "2025-02-24T09:45:00Z",
    read: true,
    userId: 102,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    type: "follow",
    message: "Michael started following you.",
    timestamp: "2025-02-24T08:30:00Z",
    read: false,
    userId: 103,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    type: "mention",
    message: "Sarah mentioned you in a post.",
    timestamp: "2025-02-23T18:20:00Z",
    read: false,
    userId: 104,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    type: "message",
    message: "You have a new message from David.",
    timestamp: "2025-02-23T15:10:00Z",
    read: true,
    userId: 105,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    type: "like",
    message: "Emily liked your comment.",
    timestamp: "2025-02-22T12:05:00Z",
    read: false,
    userId: 106,
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: 7,
    type: "repost",
    message: "Emma reposted your article.",
    timestamp: "2025-02-22T08:40:00Z",
    read: true,
    userId: 107,
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    type: "tag",
    message: "Liam tagged you in a photo.",
    timestamp: "2025-02-21T20:55:00Z",
    read: false,
    userId: 108,
    image: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: 9,
    type: "reminder",
    message: "Don't forget to check your saved posts.",
    timestamp: "2025-02-21T10:00:00Z",
    read: true,
  },
  {
    id: 10,
    type: "system",
    message: "Your password was changed successfully.",
    timestamp: "2025-02-20T05:30:00Z",
    read: true,
  },
];

function Notifictionbox() {
  const { openNotification } = useSelector((state) => state.ui);
  const Icon = useIcons();
  const dispatch = useDispatch();
  const handeClick = useCallback((e) => {
    e.stopPropagation();
    dispatch(setOpenNotification());
  }, []);
  return (
    <div
      onClick={handeClick}
      className={` ${openNotification ? " pointer-events-auto " : "pointer-events-none"} absolute w-full  h-full z-40  bg-opacity-0 border-inherit`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={` transition-all duration-150 border-inherit ${openNotification ? " scale-100 opacity-100 pointer-events-auto " : "scale-95 opacity-0 pointer-events-none"} flex flex-col justify-start items-start gap-5 sm:w-[20rem] sm:h-1/2  w-full h-full p-5 pt-0 bg-[#fff9f3] dark:bg-black border sm:rounded-lg absolute sm:right-40 right-0 sm:top-[4.3rem] top-0  overflow-y-auto`}
      >
        <div className="flex justify-between items-center gap-3 w-full p-2 bg-inherit sticky top-0 ">
          <div className="flex justify-start items-center gap-3 ">
            {Icon.bell}
            <h1>notification</h1>
          </div>
          <button className="text-xl sm:hidden" onClick={handeClick}>
            {Icon.close}
          </button>
        </div>
        <h1>will implement soon</h1>
        {/* <Suspense
          fallback={<Spinner className={"w-5 h-5 bg-black dark:bg-white"} />}
        >
          {notifications.map((noitify) => (
            <NotifictionItem data={noitify} />
          ))}
        </Suspense> */}
      </div>
    </div>
  );
}

export default Notifictionbox;
