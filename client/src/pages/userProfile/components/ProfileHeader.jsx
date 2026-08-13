import React from "react";
import ProfileImage from "../../../components/ProfileImage";
import Follow from "../../../components/buttons/follow";
import DisplayUsername from "../../../components/texts/DisplayUsername";
import AbbreviateNumber from "../../../utils/components/AbbreviateNumber";
import FormatedTime from "../../../components/utilityComp/FormatedTime";
import useIcons from "../../../hooks/useIcons";
import { Link } from "react-router-dom";

function ProfileHeader({ userMeta, isSelf, onOpenDrawer }) {
  const icons = useIcons();
  const displayName =
    userMeta?.displayName || userMeta?.username || "Spread Member";
  const username = userMeta?.username || "";

  return (
    <div className="w-full flex flex-col items-start gap-5 sm:gap-6 p-4 sm:p-8 spread-card rounded-3xl border border-stone-200 dark:border-stone-800">
      {/* Top Row: Avatar + Info (Row on Mobile & Desktop) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-6">
        <div className="flex items-center sm:items-start gap-4 sm:gap-5 min-w-0 w-full sm:w-auto">
          <ProfileImage
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full ring-2 ring-stone-300 dark:ring-stone-700 shadow-md shrink-0 object-cover"
            image={userMeta?.userImage}
            alt={displayName}
          />

          <div className="space-y-1 min-w-0 text-left">
            <h1 className="text-lg sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight truncate">
              {displayName}
            </h1>

            {username && (
              <DisplayUsername
                className="text-stone-500 dark:text-stone-400 font-semibold text-xs sm:text-sm"
                username={`@${username}`}
              />
            )}

            {userMeta?.createdAt && (
              <div className="flex items-center justify-start gap-1.5 text-xs text-stone-500 dark:text-stone-400 pt-0.5">
                <span className="shrink-0">{icons.calender}</span>
                <span>Joined </span>
                <FormatedTime date={userMeta.createdAt} formate="MMMM yyyy" />
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Full width on mobile, auto width on desktop */}
        <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          {isSelf ? (
            <Link
              to="/profileEditor"
              className="spread-btn-secondary w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-full shadow-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-xs">{icons.edit}</span>
              <span>Edit Profile</span>
            </Link>
          ) : (
            userMeta && (
              <Follow
                person={userMeta}
                className="w-full sm:w-auto px-6 py-2 text-xs flex justify-center"
              />
            )
          )}
        </div>
      </div>

      {/* Bio */}
      {userMeta?.bio && (
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl text-left whitespace-pre-line break-words">
          {userMeta.bio}
        </p>
      )}

      {/* Followers / Following Stats Pills */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 pt-1">
        <button
          type="button"
          onClick={() => onOpenDrawer("followers")}
          className="spread-pill text-xs px-3.5 sm:px-4 py-2 font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer text-stone-800 dark:text-stone-200"
        >
          <span className="text-stone-600 dark:text-stone-400 text-sm">{icons.users}</span>
          <span>
            <AbbreviateNumber rawNumber={userMeta?.Followers?.length || 0} /> Followers
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDrawer("following")}
          className="spread-pill text-xs px-3.5 sm:px-4 py-2 font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer text-stone-800 dark:text-stone-200"
        >
          <span className="text-stone-600 dark:text-stone-400 text-sm">{icons.userCheck}</span>
          <span>
            <AbbreviateNumber rawNumber={userMeta?.Following?.length || 0} /> Following
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
