import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "/ProfOutlook.png";

import Follow from "./buttons/follow";
import userImageSrc from "../utils/userImageSrc";
function PeoplesList({ people, index, className }) {
  const [isUserhover, setuserHower] = useState(false);
  const userRef = useRef();
  const { userImageurl, IsuserFromOAth } = userImageSrc(people);
  return (
    <li
      className={`flex mt-2 justify-between px-2 w-full  gap-3 font-medium capitalize items-center   ${className} relative dark:border-[#383838]`}
      key={people?.id}
      id={people?.id}
    >
      <Link
        className="flex gap-2 justify-between border-inherit"
        to={`/profile/@${people?.username.split(" ").join("")}/${people?.id}`}
      >
        <img
          className="h-[30px] rounded-full w-[30px] object-cover object-top"
          src={userImageurl}
          alt={`${people?.username}'s profile picture`}
        />
        <div
          onMouseOver={() => setuserHower(true)}
          onMouseOut={() => setuserHower(false)}
          className=" flex ms-3 gap-2  justify-center overflow-hidden flex-col items-start border-inherit "
        >
          <h1 className="">{people?.username}</h1>
          {isUserhover && (
            <div className=" absolute animate-fedin.2s z-30 w-auto flex flex-col gap-2 border  mt-[90px] bg-white border-inherit dark:bg-[#222222] font-normal text-[12px] p-3 overflow-hidden overflow-ellipsis rounded-md ">
              <div className=" flex gap-4 justify-start items-center font-medium ">
                {" "}
                <img
                  className="h-[1.5rem] rounded-full w-[1.5rem] object-cover object-top"
                  src={people?.userImage ? `${people?.userImage}` : profileIcon}
                  alt={`${people?.username}'s profile picture`}
                />
                <h1 className=" text-sm hover:underline">{people?.username}</h1>
              </div>

              <p className=" pl-8">{people?.bio}</p>
            </div>
          )}
        </div>
      </Link>
      <Follow
        People={people}
        className={
          "w-[85px] h-7 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-full"
        }
      />
    </li>
  );
}

export default memo(PeoplesList);
