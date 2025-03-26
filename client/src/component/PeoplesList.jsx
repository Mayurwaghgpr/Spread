import React, { forwardRef, memo, useRef } from "react";
import { usePopper } from "react-popper";
import userImageSrc from "../utils/userImageSrc";
import UserPopover from "./utilityComp/UserPopover";
import ProfileImage from "./ProfileImage";

const PeoplesList = forwardRef(
  ({ people, className, children, action, popover = true }, ref) => {
    const buttonRef = useRef(null);
    const boxRef = useRef(null);
    const { userImageurl } = userImageSrc(people);

    const { styles, attributes } = usePopper(
      buttonRef.current,
      boxRef.current,
      {
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
      }
    );

    return (
      <li
        ref={ref}
        className={`${className} font-medium capitalize  relative dark:border-[#383838]`}
        key={people?.id}
        id={people?.id}
      >
        <div
          ref={buttonRef}
          className="relative group border-inherit cursor-pointer "
        >
          <button
            className="flex items-center gap-3 border-inherit h-full "
            onClick={action}
          >
            <ProfileImage className=" w-10 h-10 " image={userImageurl} />

            <p className="hover:underline  underline-offset-4 overflow-hidden text-ellipsis whitespace-nowrap">
              {people?.username}
            </p>
          </button>
          {popover && (
            <UserPopover
              ref={boxRef}
              people={people}
              className="z-40 px-4 w-[20rem] absolute transition-all duration-500 top-11  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:flex flex-col gap-3 border bg-[#e8e4df] shadow-md border-inherit dark:bg-black font-normal text-sm p-3 overflow-hidden rounded-md"
              attributes={attributes}
              styles={styles}
            />
          )}
        </div>

        {children}
      </li>
    );
  }
);

export default memo(PeoplesList);
