import React from "react";
import ThemeBtn from "../buttons/ThemeBtn";
import { useSelector } from "react-redux";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/userImageSrc";

const Modes = [
  {
    name: "Dark mode",
    value: "dark",
    icon: "moonFi",
  },
  {
    name: "Light mode",
    value: "light",
    icon: "sun",
  },
  {
    name: "System",
    value: "system",
    icon: "desktopO",
  },
];

function DesktopTooltip() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userImageurl } = userImageSrc(user);
  return (
    <div className="absolute top-full right-0 mt-1 w-64 opacity-0 group-hover:opacity-100  transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto hidden lg:block">
      <div className="bg-[#fff9f3] dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-2xl p-4 backdrop-blur-sm">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <ProfileImage
            image={userImageurl}
            className="w-12 h-12 border-2  rounded-full border-gray-200 dark:border-gray-700"
            alt={user?.displayName}
            disabled
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {user?.displayName}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </p>
          <ThemeBtn
            Modes={Modes}
            separate={true}
            className="flex gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 px-5 w-fit"
          />
        </div>

        {/* Logout Button */}
        <LogoutBtn className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium" />
      </div>
    </div>
  );
}

export default DesktopTooltip;
