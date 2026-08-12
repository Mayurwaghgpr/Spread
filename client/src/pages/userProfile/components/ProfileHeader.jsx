import React from "react";
import ProfileImage from "../../../components/ProfileImage";
import Follow from "../../../components/buttons/follow";
import DisplayUsername from "../../../components/texts/DisplayUsername";
import AbbreviateNumber from "../../../utils/components/AbbreviateNumber";
import FormatedTime from "../../../components/utilityComp/FormatedTime";
import { Edit3, Calendar, Users, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

function ProfileHeader({ userMeta, isSelf, onOpenDrawer }) {
  const displayName =
    userMeta?.displayName || userMeta?.username || "Spread Member";
  const username = userMeta?.username || "";

  return (
    <div className="w-full flex flex-col items-center sm:items-start gap-6 p-6 sm:p-8 spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-6">
        {/* User Info & Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left min-w-0">
          <ProfileImage
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-2 ring-stone-300 dark:ring-stone-700 shadow-md shrink-0"
            image={userMeta?.userImage}
            alt={displayName}
          />

          <div className="space-y-1.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight truncate">
              {displayName}
            </h1>

            {username && (
              <DisplayUsername
                className="text-stone-500 dark:text-stone-400 font-semibold text-xs sm:text-sm"
                username={`@${username}`}
              />
            )}

            {userMeta?.createdAt && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-500 dark:text-stone-400 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined </span>
                <FormatedTime date={userMeta.createdAt} formate="MMMM yyyy" />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {isSelf ? (
            <Link
              to="/profileEditor"
              className="spread-btn-secondary px-5 py-2 text-xs font-bold rounded-full shadow-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          ) : (
            userMeta && <Follow person={userMeta} className="px-6 py-2 text-xs" />
          )}
        </div>
      </div>

      {/* Bio */}
      {userMeta?.bio && (
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl text-center sm:text-left">
          {userMeta.bio}
        </p>
      )}

      {/* Followers / Following Stats Pills */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onOpenDrawer("followers")}
          className="spread-pill text-xs px-4 py-2 font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer text-stone-800 dark:text-stone-200"
        >
          <Users className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          <span>
            <AbbreviateNumber rawNumber={userMeta?.Followers?.length || 0} /> Followers
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDrawer("following")}
          className="spread-pill text-xs px-4 py-2 font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer text-stone-800 dark:text-stone-200"
        >
          <UserCheck className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          <span>
            <AbbreviateNumber rawNumber={userMeta?.Following?.length || 0} /> Following
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
