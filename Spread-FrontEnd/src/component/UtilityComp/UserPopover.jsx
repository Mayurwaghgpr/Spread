import React, { forwardRef } from "react";
import Follow from "../buttons/follow";
import { Link } from "react-router-dom";

const UserPopover = forwardRef(({ people, styles, attributes }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute -left-24 top-8 animate-fedin.2s z-30 px-4 w-[20rem] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:flex flex-col gap-3 border bg-[#e8e4df] shadow-md border-inherit dark:bg-black font-normal text-sm p-3 overflow-hidden overflow-ellipsis rounded-md "
      // style={styles.popper}
      // {...attributes.popper}
    >
      <div className=" flex flex-row justify-between items-center font-medium ">
        {" "}
        <Link
          className="flex gap-4 items-center"
          to={`/profile/@${people?.username.split(" ").join("")}/${people?.id}`}
        >
          <img
            className=" rounded-full size-[2.5rem] object-cover object-top"
            src={people?.userImage ? `${people?.userImage}` : profileIcon}
            alt={`${people?.username}'s profile picture`}
          />
          <h1 className="text-sm hover:underline underline-offset-4">
            {people?.username}
          </h1>
        </Link>
        <Follow
          People={people}
          className={
            "relative  p-1 py-2  transition-all text-xs max-w-[5rem] w-full  duration-200b g-white hover:bg-gray-100  dark:hover:bg-gray-700 rounded-full "
          }
        />
      </div>
      <div className=" relative flex text-ellipsis ">
        <p className=" ">{people?.bio}</p>
      </div>

      <div className=" flex w-full  gap-5 dark:text-white  text-[#222222] dark:opacity-50 text-opacity-20">
        <div>
          <span>{people?.Followers?.length}</span> Followers
        </div>
        <div>
          {" "}
          <span>{people?.Following?.length}</span> Following
        </div>
      </div>
    </div>
  );
});

export default UserPopover;
