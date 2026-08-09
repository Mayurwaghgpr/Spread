import { forwardRef, memo } from "react";
import userImageSrc from "../utils/functions/userImageSrc";
import ProfileHoverCard from "./utilityComp/ProfileHoverCard";
import ProfileImage from "./ProfileImage";

const personsList = forwardRef(
  ({ person, className, children, action, popover = true }, ref) => {
    const { userImageurl } = userImageSrc(person);

    const userContent = (
      <button
        className="flex items-center gap-3 border-inherit h-full w-full"
        onClick={action}
        aria-label={`View ${person?.username || "user"} profile`}
      >
        <ProfileImage
          className="w-8 h-8 rounded-full transition-opacity duration-200"
          image={person && userImageurl}
        />

        <span className="overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200">
          {person?.username}
        </span>
      </button>
    );

    return (
      <li
        ref={ref}
        className={`${className} font-medium capitalize relative text-xs border-inherit`}
        key={person?.id}
        id={person?.id}
      >
        <div className="relative border-inherit cursor-pointer w-full h-full flex items-center justify-start gap-3">
          {popover && person ? (
            <ProfileHoverCard person={person} className="w-full">
              {userContent}
            </ProfileHoverCard>
          ) : (
            userContent
          )}
        </div>

        {children}
      </li>
    );
  }
);

export default memo(personsList);
