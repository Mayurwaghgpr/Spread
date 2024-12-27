import React, { memo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePopper } from "react-popper";
import Follow from "./buttons/follow";
import userImageSrc from "../utils/userImageSrc";
import UserPopover from "./UtilityComp/UserPopover";

function PeoplesList({ people, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const boxRef = useRef(null);
  const { userImageurl } = userImageSrc(people);

  const { styles, attributes } = usePopper(buttonRef.current, boxRef.current, {
    placement: "left-start", // Set the popper to the left of the reference
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          boundary: "clippingParents",
        },
      },
      {
        name: "offset",
        options: {
          offset: [-20, 0], // Adjust the gap (negative X offset moves it closer to the left)
        },
      },
    ],
  });

  return (
    <li
      className={`${className} flex justify-between  w-full h-full gap-3 font-medium capitalize items-center relative dark:border-[#383838]`}
      key={people?.id}
      id={people?.id}
    >
      <div className="relative group  border-inherit *:transition-all *:duration-200 cursor-pointer text-ellipsis">
        <Link
          className="flex items-center gap-3 border-inherit h-full"
          to={`/profile/@${people?.username.split(" ").join("")}/${people?.id}`}
        >
          <img
            className="max-w-10 max-h-10 rounded-full  object-cover object-top"
            src={userImageurl}
            alt={`${people?.username}'s profile picture`}
          />
          <h1 className="hover:underline touch-pan-up underline-offset-4">
            {people?.username}
          </h1>
        </Link>

        <UserPopover
          people={people}
          ref={boxRef}
          // attributes={attributes}
          // styles={styles}
        />
      </div>

      <Follow
        People={people}
        className=" text-black min-h-8  min-w-[6.7rem] border  p-1 flex justify-center items-center  *:transition-all  px-5 *:duration-100 bg-white hover:bg-gray-300   rounded-full  "
      />
    </li>
  );
}

export default memo(PeoplesList);
