import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePopper } from "react-popper";
import Follow from "./buttons/follow";
import userImageSrc from "../utils/userImageSrc";
import UserPopover from "./UtilityComp/UserPopover";
function PeoplesList({ people, index, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const boxRef = useRef(null);
  const [isUserhover, setuserHower] = useState(false);
  const { userImageurl, IsuserFromOAth } = userImageSrc(people);

  const { styles, attributes } = usePopper(buttonRef.current, boxRef.current, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          boundary: "viewport",
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8], // Adjusts the gap between the button and the menu
        },
      },
    ],
  });
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
            <UserPopover
              people={people}
              ref={boxRef}
              attributes={attributes}
              styles={styles}
            />
          )}
        </div>
      </Link>
      <Follow
        People={people}
        className={
          " h-10 transition-all min-w-[5.5rem]   duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
        }
      />
    </li>
  );
}

export default memo(PeoplesList);
