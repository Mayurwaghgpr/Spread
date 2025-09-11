import React, { forwardRef } from "react";
import { CheckCircle, MapPin, Calendar, ExternalLink } from "lucide-react";
import AbbreviateNumber from "../../utils/AbbreviateNumber";

// Mock Follow component for demo
const Follow = ({ person, className }) => (
  <button className={className}>
    {person?.isFollowing ? "Following" : "Follow"}
  </button>
);

const UserPopover = forwardRef(
  ({ person, styles, attributes, className }, ref) => {
    if (!person) {
      return (
        <div
          ref={ref}
          className={`${className} z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse`}
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
        className={`${className} z-50  rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-light dark:bg-dark w-full`}
        role="dialog"
        aria-label={`${person?.username}'s profile information`}
        style={styles?.popper}
        {...attributes?.popper}
      >
        {/* Main content */}
        <div className=" flex flex-col gap-3 items-start p-3  relative w-full">
          {/* Avatar and basic info */}
          <div className="flex items-start justify-between gap-3 w-full">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100 dark:border-gray-900 dark:ring-gray-800  object-top"
                  src={person?.userImage || "/api/placeholder/64/64"}
                  alt={`${person?.username}'s profile picture`}
                  loading="lazy"
                />
                {person?.isVerified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 fill-current bg-white rounded-full" />
                )}
                {person?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0 max-w-20">
                <a
                  href={`/profile/@${person?.username}/${person?.id}`}
                  className="group block"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {person?.displayName || person?.username}
                    </h2>
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-gray-500 text-nowrap dark:text-gray-400 text-sm">
                    @{person?.username}
                  </p>
                </a>
              </div>
            </div>

            <Follow
              person={person}
              className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
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
            {person?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{person.location}</span>
              </div>
            )}
            {person?.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Joined {person.createdAt}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                {<AbbreviateNumber rawNumber={person?.Followers?.length} />}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                {<AbbreviateNumber rawNumber={person?.Following?.length} />}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Following
              </div>
            </div>
            {person?.postsCount && (
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
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
