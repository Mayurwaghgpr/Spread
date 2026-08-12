import { forwardRef, memo } from "react";
import userImageSrc from "../utils/functions/userImageSrc";
import ProfileHoverCard from "./utilityComp/ProfileHoverCard";
import ProfileImage from "./ProfileImage";

const PeoplesList = forwardRef(
  ({ person, className = "", children, action, popover = true }, ref) => {
    const { userImageurl } = userImageSrc(person);

    const userContent = (
      <div
        className="flex items-center gap-3 w-full cursor-pointer min-w-0"
        onClick={action}
        role="button"
        tabIndex={0}
        aria-label={`View ${person?.displayName || person?.username || "user"} profile`}
      >
        <ProfileImage
          className="w-10 h-10 rounded-full shrink-0 ring-1 ring-stone-300 dark:ring-stone-700 transition-all duration-200 hover:ring-stone-500"
          image={person && userImageurl}
        />

        <div className="flex flex-col min-w-0 flex-1 text-left">
          <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
            {person?.displayName || "Unknown User"}
          </span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
            @{person?.username || "username"}
          </span>
        </div>
      </div>
    );

    return (
      <li
        ref={ref}
        className={`flex items-center justify-between gap-3 w-full p-2.5 rounded-2xl hover:bg-stone-200/50 dark:hover:bg-stone-800/40 transition-colors border-inherit ${className}`}
        id={person?.id}
      >
        <div className="relative border-inherit w-full min-w-0 flex items-center justify-start gap-3">
          {popover && person ? (
            <ProfileHoverCard person={person} className="w-full">
              {userContent}
            </ProfileHoverCard>
          ) : (
            userContent
          )}
        </div>

        {children && <div className="shrink-0">{children}</div>}
      </li>
    );
  }
);

export default memo(PeoplesList);
