import React from "react";
import { useSelector } from "react-redux";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/functions/userImageSrc";
import { Link } from "react-router-dom";

function DesktopTooltip() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userImageurl } = userImageSrc(user);

  return (
    <div className="absolute top-full right-0 mt-2 w-64 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto hidden lg:block z-50">
      <div className="bg-[#f5f1ec] dark:bg-[#121212] border border-inherit rounded-2xl shadow-2xl p-4 backdrop-blur-md">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-inherit">
          <Link to={`/profile/@${user?.username}/${user?.id}`}>
            <ProfileImage
              image={userImageurl}
              className="w-11 h-11 border border-inherit rounded-full hover:opacity-90 transition-opacity"
              alt={user?.displayName}
            />
          </Link>
          <div className="border-inherit overflow-hidden">
            <Link
              to={`/profile/@${user?.username}/${user?.id}`}
              className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate hover:underline block"
            >
              {user?.displayName || user?.username}
            </Link>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* View Profile Link */}
        <div className="mb-3 pb-2 border-b border-inherit">
          <Link
            to={`/profile/@${user?.username}/${user?.id}`}
            className="spread-pill block text-center text-xs hover:opacity-90 transition-opacity font-semibold"
          >
            View Profile
          </Link>
        </div>

        {/* Logout Button */}
        <LogoutBtn className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-inherit rounded-xl transition-all duration-200 font-medium" />
      </div>
    </div>
  );
}

export default DesktopTooltip;
