import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "/ProfOutlook.png";

import Follow from "./buttons/follow";
import userImageSrc from "../utils/userImageSrc";
function PeoplesList({ people, index, className }) {
  const [isUserhover, setuserHower] = useState(false);
  const userRef = useRef();
  const { userImageurl, IsuserFromOAth } = userImageSrc(people);
  console.log(JSON.stringify(people));
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
            <div className=" absolute animate-fedin.2s z-30 px-4 right-36 top-2 w-[20rem] flex flex-col gap-3 border bg-white border-inherit dark:bg-black font-normal text-[1rem] p-3 overflow-hidden overflow-ellipsis rounded-md ">
              <div className=" flex flex-row justify-between items-center font-medium ">
                {" "}
                <div className="flex gap-4 items-center">
                  <img
                    className=" rounded-full w-[2rem] object-cover object-top"
                    src={
                      people?.userImage ? `${people?.userImage}` : profileIcon
                    }
                    alt={`${people?.username}'s profile picture`}
                  />
                  <h1 className="text-sm hover:underline underline-offset-4">
                    {people?.username}
                  </h1>
                </div>
                <Follow
                  People={people}
                  className={
                    " h-10 transition-all text-xs max-w-[5rem] w-full  duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
                  }
                />
              </div>
              <div className=" relative flex text-ellipsis ">
                <p className=" ">
                  {people?.bio} Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Totam dolorum sapiente omnis distinctio eos
                  molestiae{" "}
                </p>
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
          )}
        </div>
      </Link>
      <Follow
        People={people}
        className={
          " h-10 transition-all min-w-[5.5rem]  duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
        }
      />
    </li>
  );
}

export default memo(PeoplesList);
