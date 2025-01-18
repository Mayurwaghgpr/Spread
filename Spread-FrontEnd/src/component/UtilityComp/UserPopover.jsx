import React, { forwardRef } from "react";
import Follow from "../buttons/follow";
import { Link } from "react-router-dom";

const UserPopover = forwardRef(
  ({ people, styles, attributes, className }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className=" flex flex-row  gap-3 justify-between items-center font-medium ">
          {" "}
          <Link
            className="flex gap-4 items-center"
            to={`/profile/@${people?.username}/${people?.id}`}
          >
            <img
              className=" rounded-full size-[2.5rem] object-cover object-top"
              src={people?.userImage ? `${people?.userImage}` : profileIcon}
              alt={`${people?.username}'s profile picture`}
            />
            <h1 className="hover:underline underline-offset-4 overflow-hidden text-ellipsis whitespace-nowrap">
              {people?.username}
            </h1>
          </Link>
          <Follow
            People={people}
            className={
              "relative text-black  p-1 py-2 border transition-all text-xs max-w-[5rem] w-full  duration-200b g-white bg-white hover:bg-gray-300 rounded-full "
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
  }
);

export default UserPopover;
