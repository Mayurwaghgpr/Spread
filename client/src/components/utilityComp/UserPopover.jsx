import { forwardRef } from "react";
import AbbreviateNumber from "../../utils/components/AbbreviateNumber";
import Follow from "../buttons/follow";
import FormatedTime from "./FormatedTime";
import useIcons from "../../hooks/useIcons";
import DisplayUsername from "../texts/DisplayUsername";
import { Link } from "react-router-dom";

const UserPopover = forwardRef(
  ({ person, styles, attributes, className }, ref) => {
    const icons = useIcons();

    return (
      <div
        ref={ref}
        className={`${className} rounded-2xl border border-inherit overflow-hidden bg-[#f5f1ec] dark:bg-[#121212] shadow-2xl backdrop-blur-md w-full max-w-sm`}
        role="dialog"
        aria-label={`${person?.username}'s profile information`}
        style={styles?.popper}
        {...attributes?.popper}
      >
        {/* Main content */}
        <div className="flex flex-col gap-3 items-start p-4 relative w-full">
          {/* Avatar and basic info */}
          <div className="flex items-start justify-between gap-3 w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="relative shrink-0">
                <img
                  className="w-14 h-14 rounded-full object-cover object-top border border-inherit"
                  src={person?.userImage || "/api/placeholder/64/64"}
                  alt={`${person?.username}'s profile picture`}
                  loading="lazy"
                />
                {person?.isVerified && (
                  <span className="absolute -bottom-1 flex items-center justify-center -right-1 w-5 h-5 text-blue-500 fill-current rounded-full">
                    {icons["circleCheck"]}
                  </span>
                )}
                {person?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/@${person?.username}/${person?.id}`}
                  className="group block"
                >
                  <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:underline transition-colors truncate">
                    {person?.displayName || person?.username}
                  </h2>
                </Link>
                <Link
                  to={`/profile/@${person?.username}/${person?.id}`}
                  className="group block"
                >
                  <DisplayUsername
                    className="text-stone-500 dark:text-stone-400 font-medium text-xs truncate"
                    username={`@${person?.username}`}
                  />
                </Link>
              </div>
            </div>

            <Follow
              person={person}
              className="px-3.5 py-1.5 text-xs shrink-0"
            />
          </div>

          {/* Bio */}
          {person?.bio && (
            <div>
              <p className="text-stone-700 dark:text-stone-300 text-xs leading-relaxed line-clamp-3">
                {person.bio}
              </p>
            </div>
          )}

          {/* Additional info */}
          {person?.createdAt && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="w-3.5 h-3.5 flex items-center">{icons["calender"]}</span>
              <span>Joined </span>
              <FormatedTime date={person.createdAt} formate={"d LLL yyy"} />
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-5 pt-3 text-xs border-t border-inherit w-full text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-1">
              <span className="font-bold text-stone-900 dark:text-stone-100">
                <AbbreviateNumber rawNumber={person?.Followers?.length || 0} />
              </span>
              <span className="text-stone-500 dark:text-stone-400">Followers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-stone-900 dark:text-stone-100">
                <AbbreviateNumber rawNumber={person?.Following?.length || 0} />
              </span>
              <span className="text-stone-500 dark:text-stone-400">Following</span>
            </div>
            {person?.postsCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  <AbbreviateNumber rawNumber={person.postsCount} />
                </span>
                <span className="text-stone-500 dark:text-stone-400">Posts</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

UserPopover.displayName = "UserPopover";

export default UserPopover;
