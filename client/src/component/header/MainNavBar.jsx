import React, { useRef, memo, useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ThemeBtn from "../buttons/ThemeBtn";
import { setManuOpen } from "../../store/slices/uiSlice";

import NotifictionBell from "../notification/NotificationBell";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import spreadLogo from "/spread_logo_03_robopus.png";
import DesktopTooltip from "./DesktopTooltip";

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

  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

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
    <header className="  col-span-full row-span-1 z-50 px-4 sm:px-8 lg:px-20 py-3 bg-light dark:bg-dark backdrop-blur-xl border-b border-inherit ">
      <nav className="max-w-7xl mx-auto border-inherit">
        <div className="flex items-center justify-between border-inherit">
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
          <div className="flex items-center gap-4 border-inherit">
            <ThemeBtn className="" Modes={Modes} />
            {isLogin && (
              <>
                {/* Notification Bell */}
                <NotifictionBell />
                {/* User Profile Section */}
                <div className="relative group border-inherit">
                  <ProfileImage
                    onClick={() => dispatch(setManuOpen())}
                    className={`box-content border-3  w-7 h-7 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                      isProfileActive
                        ? "border-gray-500 dark:border-gray-400 ring-2 ring-gray-200 dark:ring-gray-800"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    image={userImageurl}
                    alt={user?.displayName}
                  />

                  {/* Desktop Tooltip */}
                  <DesktopTooltip />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default memo(MainNavBar);
