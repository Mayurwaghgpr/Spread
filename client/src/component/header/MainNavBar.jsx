import React, { useRef, memo, useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ThemeBtn from "../buttons/ThemeBtn";
import { setManuOpen } from "../../store/slices/uiSlice";

import LogoutBtn from "../buttons/LogoutBtn";
import NotifictionBell from "../notification/NotificationBell";
import { PiSignInDuotone } from "react-icons/pi";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import useIcons from "../../hooks/useIcons";
import spreadLogo from "/spread_logo_03_robopus.png";

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

function MainNavBar() {
  const [deviceSize, setDeviceSize] = useState(window.innerWidth);
  const { MenuOpen } = useSelector((state) => state.ui);
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);
  const { ThemeMode } = useSelector((state) => state.ui);
  const { userImageurl } = userImageSrc(user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setDeviceSize(window.innerWidth);
    };

    // Set initial size
    setDeviceSize(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isProfileActive = useMemo(() => {
    return (
      location.pathname.startsWith("/profile") && userProfile?.id === user?.id
    );
  }, [location.pathname, userProfile?.id, user?.id]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-20 py-3 bg-[#fff9f3]/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/50 shadow-sm dark:shadow-gray-900/20">
      <nav className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group transition-all duration-200 hover:opacity-80"
          >
            <ProfileImage
              image={spreadLogo}
              className="w-10 h-10 scale-110 transition-all duration-200"
              alt="Spread Logo"
            />
            <span className="sm:block hidden text-xl font-bold bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-700 dark:to-gray-400 bg-clip-text text-transparent">
              Spread
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isLogin && (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <NotifictionBell />
                </div>

                {/* User Profile Section */}
                <div className="relative group">
                  <ProfileImage
                    onClick={() => dispatch(setManuOpen())}
                    className={`box-content border-3 sm:w-10 sm:h-10 w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                      isProfileActive
                        ? "border-gray-500 dark:border-gray-400 ring-2 ring-gray-200 dark:ring-gray-800"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    image={userImageurl}
                    alt={user?.displayName}
                    disabled={deviceSize <= 639}
                  />

                  {/* Desktop Tooltip */}
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
                          className="flex gap-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-1"
                        />
                      </div>

                      {/* Logout Button */}
                      <LogoutBtn className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Sign In Button for Non-logged Users */}
            {!isLogin && (
              <Link
                to="/auth/signin"
                className="flex items-center gap-2 px-6 py-2.5  rounded-full font-medium transition-all duration-200  text-sm sm:text-base"
              >
                <PiSignInDuotone className="text-lg" />
                <span className="sm:block hidden">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default memo(MainNavBar);
