import { memo, useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ThemeBtn from "../buttons/ThemeBtn";
import { setMenuOpen } from "../../store/slices/uiSlice";

import NotifictionBell from "../notification/NotificationBell";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import DesktopTooltip from "./DesktopTooltip";
import useIcons from "../../hooks/useIcons";

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
  const { menuOpen } = useSelector((state) => state.ui);

  const { userImageurl } = userImageSrc(user);
  const location = useLocation();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const icons = useIcons();

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
    <header className=" sticky  z-40 px-5 sm:pr-8 lg:pr-20 py-3 bg-light dark:bg-dark backdrop-blur-xl  border-inherit ">
      <nav className=" border-inherit">
        <div className="flex items-center justify-between border-inherit">
          <div className="w-full">
            {deviceSize > 720 && (
              <button
                onClick={() => dispatch(setMenuOpen())}
                className={`border border-inherit rounded-lg  ${menuOpen ? " hidden" : "xl:block hidden"}  p-1 `}
              >
                {icons["menu"]}
              </button>
            )}
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
                    onClick={() => dispatch(setMenuOpen())}
                    className={`box-content border-3  w-7 h-7 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                      isProfileActive
                        ? "border-gray-500 dark:border-gray-400 ring-2 ring-gray-200 dark:ring-gray-800"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    image={userImageurl}
                    alt={user?.displayName}
                    disabled={deviceSize > 720}
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
