import React, { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { usePopper } from "react-popper";
import PropTypes from "prop-types";
import Follow from "./buttons/follow";
import userImageSrc from "../utils/userImageSrc";
import UserPopover from "./utilityComp/UserPopover";

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
      className={`${className} flex w-full h-full gap-1 font-medium capitalize items-center relative dark:border-[#383838]`}
      key={people?.id}
      id={people?.id}
    >
      <div
        ref={buttonRef}
        className="relative group border-inherit cursor-pointer w-[60%]"
      >
        <Link
          className="flex items-center gap-3 border-inherit h-full w-full "
          to={`/profile/@${people?.username}/${people?.id}`}
        >
          <div className=" w-10 h-10 ">
            <img
              className="w-full h-full rounded-full object-cover object-top"
              src={userImageurl}
              alt={`${people?.username || "User"}'s profile picture`}
              loading="lazy"
            />
          </div>

          <p className="hover:underline  underline-offset-4 overflow-hidden text-ellipsis whitespace-nowrap">
            {people?.username}
          </p>
        </Link>

        <UserPopover
          ref={boxRef}
          people={people}
          className="z-40 px-4 w-[20rem] absolute top-11  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:flex flex-col gap-3 border bg-[#e8e4df] shadow-md border-inherit dark:bg-black font-normal text-sm p-3 overflow-hidden rounded-md"
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
