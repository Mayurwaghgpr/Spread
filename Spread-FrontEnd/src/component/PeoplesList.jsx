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
      className={`group flex mt-2 justify-between px-2 w-full gap-3 font-medium capitalize items-center ${className} relative dark:border-[#383838]`}
      key={people?.id}
      id={people?.id}
    >
      <Link
        className="flex gap-2 justify-start border-inherit"
        to={`/profile/@${people?.username.split(" ").join("")}/${people?.id}`}
      >
        <img
          className="h-[30px] rounded-full w-[30px] object-cover object-top"
          src={userImageurl}
          alt={`${people?.username}'s profile picture`}
        />
        <div className="flex ms-3 gap-2 justify-center flex-col items-start border-inherit  text-ellipsis">
          <h1>{people?.username} </h1>
        </div>
      </Link>
      <UserPopover
        people={people}
        ref={boxRef}
        // attributes={attributes}
        // styles={styles}
      />
      <Follow
        People={people}
        className="border min-h-10  p-1 flex justify-center items-center border-black transition-all min-w-[5.5rem] px-5 duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
      />
    </li>
  );
}

export default memo(PeoplesList);
