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
      buttonRef.current && boxRef.current
        ? {
            placement: "top-start",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [-60, 1],
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
        : {}
    );

    return (
      <li
        ref={ref}
        className={`${className} font-medium capitalize  relative dark:border-[#383838] text-xs`}
        key={people?.id}
        id={people?.id}
      >
        <div
          ref={buttonRef}
          className="relative group border-inherit cursor-pointer w-full h-full flex items-center justify-start gap-3"
        >
          <button
            className="flex items-center gap-3 border-inherit h-full w-full"
            onClick={action}
            aria-label={`View ${people?.username || "user"} profile`}
            aria-describedby={popover ? `popover-${people?.id}` : undefined}
          >
            <ProfileImage
              className={`w-8 h-8 rounded-full transition-opacity duration-200 ${
                !people
                  ? "dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30 animate-pulse"
                  : ""
              }`}
              image={people && userImageurl}
            />

            <span
              className={`overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 ${
                !people
                  ? "dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30 animate-pulse py-4 w-full max-w-56 rounded-full"
                  : ""
              }`}
            >
              {people?.username}
            </span>
          </button>
          {popover && people && (
            <UserPopover
              id={`popover-${people?.id}`}
              ref={boxRef}
              people={people}
              className="z-20 px-4 w-[20rem] absolute transition-all duration-300 top-8  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:flex flex-col gap-3 border bg-[#e8e4df] shadow-md border-inherit dark:bg-black font-normal text-sm p-3 overflow-hidden rounded-md"
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
