import { forwardRef } from "react";
import { CheckCircle, MapPin, Calendar, ExternalLink } from "lucide-react";
import AbbreviateNumber from "../../utils/AbbreviateNumber";
import Follow from "../buttons/follow";
import FormatedTime from "./FormatedTime";
import useIcons from "../../hooks/useIcons";
import DisplayUsername from "../texts/DisplayUsername";
import { Link } from "react-router-dom";

const UserPopover = forwardRef(
  ({ person, styles, attributes, className }, ref) => {
    const icons = useIcons();
    if (!person) {
      return (
        <div
          ref={ref}
          className={`${className} bg-light dark:bg-dark rounded-2xl shadow-xl border border-inherit p-6 animate-pulse`}
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${className} rounded-2xl
         border border-inherit overflow-hidden bg-light dark:bg-dark w-full`}
        role="dialog"
        aria-label={`${person?.username}'s profile information`}
        style={styles?.popper}
        {...attributes?.popper}
      >
        {/* Main content */}
        <div className=" flex flex-col gap-3 items-start p-3  relative w-full">
          {/* Avatar and basic info */}
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex items-center gap-4 w-full">
              <div className="relative">
                <img
                  className="w-16 h-16 rounded-full object-cover  object-top"
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
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0 max-w-32">
                <Link
                  to={`/profile/@${person?.username}/${person?.id}`}
                  className="group block"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm  group-hover:text-blue-600 dark:group-hover:text-blue-400 hover:underline transition-colors  overflow-hidden text-ellipsis whitespace-nowrap">
                      {person?.displayName || person?.username}
                    </h2>
                  </div>
                </Link>
                <Link
                  to={`/profile/@${person?.username}/${person?.id}`}
                  className="group block"
                >
                  <DisplayUsername
                    className=" opacity-50 font-thin"
                    username={`@${person?.username}`}
                  />
                </Link>
              </div>
            </div>

            <Follow
              person={person}
              className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 text-sm  transform hover:scale-105"
            />
          </div>

          {/* Bio */}
          {person?.bio && (
            <div className="">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {person.bio}
              </p>
            </div>
          )}

          {/* Additional info */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
            {/* {person?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{person.location}</span>
              </div>
            )} */}
            {person?.createdAt && (
              <div className="flex items-center justify-start  gap-2">
                <div className="flex items-center justify-start  gap-1">
                  {" "}
                  {icons["calender"]}
                  <span>Joined </span>{" "}
                </div>

                <FormatedTime date={person.createdAt} formate={"d LLL yyy"} />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-4 sm:text-sm text-xs  border-t border-gray-100 dark:border-gray-800 w-full">
            <div className=" flex items-center justify-start gap-1 text-center">
              <div className="">
                {<AbbreviateNumber rawNumber={person?.Followers?.length} />}
              </div>
              <div className="  tracking-wide">Followers</div>
            </div>
            <div className=" flex items-center justify-start gap-1 text-center">
              <div className=" ">
                {<AbbreviateNumber rawNumber={person?.Following?.length} />}
              </div>
              <div className=" tracking-wide">Following</div>
            </div>
            {person?.postsCount && (
              <div className="text-center">
                <div className="font-bold text-lg">
                  {<AbbreviateNumber rawNumber={person.postsCount} />}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Posts
                </div>
              </div>
            )}
          </div>

          {/* Mutual connections */}
          {/* {person?.mutualFollowers && person.mutualFollowers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {person.mutualFollowers.slice(0, 3).map((follower, index) => (
                    <img
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white object-cover"
                      src={follower.avatar || "/api/placeholder/24/24"}
                      alt={follower.username}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Followed by {person.mutualFollowers[0]?.username}
                  {person.mutualFollowers.length > 1 &&
                    ` and ${person.mutualFollowers.length - 1} other${person.mutualFollowers.length > 2 ? "s" : ""} you follow`}
                </span>
              </div>
            </div>
          )} */}
        </div>
      </div>
    );
  }
);

UserPopover.displayName = "UserPopover";

export default UserPopover;
