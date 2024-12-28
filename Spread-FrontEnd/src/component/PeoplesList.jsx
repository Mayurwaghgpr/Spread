import React, { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { usePopper } from "react-popper";
import PropTypes from "prop-types";
import Follow from "./buttons/follow";
import userImageSrc from "../utils/userImageSrc";
import UserPopover from "./UtilityComp/UserPopover";

function PeoplesList({ people, className }) {
  const buttonRef = useRef(null);
  const boxRef = useRef(null);
  const { userImageurl } = userImageSrc(people);

  const { styles, attributes } = usePopper(buttonRef.current, boxRef.current, {
    placement: "top-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [-60, 1], // Adjust to fine-tune position
        },
      },
      {
        name: "preventOverflow",
        options: {
          boundary: "clippingParents",
        },
      },
    ],
  });

  return (
    <li
      className={`${className} flex justify-between w-full h-full gap-3 font-medium capitalize items-center relative dark:border-[#383838]`}
      key={people?.id}
      id={people?.id}
    >
      <div
        ref={buttonRef}
        className="relative group border-inherit cursor-pointer text-ellipsis"
      >
        <Link
          className="flex items-center gap-3 border-inherit h-full"
          to={`/profile/@${people?.username.split(" ").join("")}/${people?.id}`}
        >
          <img
            className="max-w-10 max-h-10 rounded-full object-cover object-top"
            src={userImageurl}
            alt={`${people?.username || "User"}'s profile picture`}
          />
          <h1 className="hover:underline text-nowrap touch-pan-up underline-offset-4">
            {people?.username}
          </h1>
        </Link>

        <UserPopover
          ref={boxRef}
          people={people}
          className="z-40 px-4 w-[20rem] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:flex flex-col gap-3 border bg-[#e8e4df] shadow-md border-inherit dark:bg-black font-normal text-sm p-3 overflow-hidden rounded-md"
          attributes={attributes}
          styles={styles}
        />
      </div>

      <Follow
        People={people}
        className="text-black min-h-8 min-w-[6.7rem] border p-1 flex justify-center items-center transition-all px-5 duration-100 bg-white hover:bg-gray-300 rounded-full"
      />
    </li>
  );
}

PeoplesList.propTypes = {
  people: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default memo(PeoplesList);
