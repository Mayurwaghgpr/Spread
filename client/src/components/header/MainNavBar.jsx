import { memo, useMemo, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ThemeBtn from "../buttons/ThemeBtn";
import { setMenuOpen } from "../../store/slices/uiSlice";

import NotifictionBell from "../notification/NotificationBell";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/functions/userImageSrc";
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
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);
  const { menuOpen } = useSelector((state) => state.ui);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { userImageurl } = userImageSrc(user);
  const location = useLocation();
  const dispatch = useDispatch();
  const icons = useIcons();

  const isProfileActive = useMemo(() => {
    return (
      location.pathname.startsWith("/profile") && userProfile?.id === user?.id
    );
  }, [location.pathname, userProfile?.id, user?.id]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3.5 sm:px-6 py-2.5 bg-[#fffdfa]/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-[#e5dfd5]/80 dark:border-[#232328]/80 transition-colors">
      <nav className="w-full flex items-center justify-between" aria-label="Global header">
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle (visible whenever sidebar is closed or on mobile/tablet) */}
          {isLogin && (
            <button
              type="button"
              onClick={() => dispatch(setMenuOpen())}
              className={`p-1.5 rounded-xl border border-[#e5dfd5] dark:border-[#232328] hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] transition-colors cursor-pointer text-stone-700 dark:text-stone-300 ${
                menuOpen ? "xl:hidden flex" : "flex"
              } items-center justify-center`}
              aria-label="Toggle navigation menu"
            >
              <span className="text-base flex items-center justify-center">
                {icons["menu"]}
              </span>
            </button>
          )}

          {/* Logo & Brand Name (Jakob's Law: always anchor home on left) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-ring rounded-xl py-0.5 px-1 -ml-1 transition-transform active:scale-95"
            aria-label="Spread Home"
          >
            <img
              src="/spread_logo_03_robopus.png"
              alt="Spread"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain shrink-0 group-hover:opacity-90"
            />
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-stone-900 dark:text-stone-100">
              Spread
            </span>
          </Link>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Quick Write Story Link (Desktop/Tablet) */}
          {isLogin && (
            <Link
              to="/write"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] border border-transparent hover:border-[#e5dfd5] dark:hover:border-[#232328] transition-all cursor-pointer"
            >
              <span className="text-sm">{icons.fetherO || icons.edit}</span>
              <span>Write</span>
            </Link>
          )}

          {/* Quick Search Shortcut */}
          <Link
            to="/search"
            aria-label="Search stories"
            className="p-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] transition-colors text-base flex items-center justify-center"
          >
            {icons["search"]}
          </Link>

          {/* Theme Mode Toggle */}
          <ThemeBtn Modes={Modes} />

          {isLogin ? (
            <>
              {/* Notification Bell */}
              <NotifictionBell />

              {/* User Profile Avatar with Click Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  onClick={toggleDropdown}
                  className={`rounded-full focus-ring transition-transform active:scale-95 cursor-pointer block p-0.5 ${
                    isProfileActive
                      ? "ring-2 ring-stone-900 dark:ring-stone-100"
                      : "hover:opacity-90"
                  }`}
                  aria-label="User profile menu"
                >
                  <ProfileImage
                    as="div"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#e5dfd5] dark:border-[#232328] object-cover"
                    image={userImageurl}
                    alt={user?.displayName || user?.username}
                  />
                </button>

                {/* Accessible Profile Dropdown Menu */}
                <DesktopTooltip
                  isOpen={isDropdownOpen}
                  onClose={closeDropdown}
                />
              </div>
            </>
          ) : (
            /* Logged-Out Actions: Sign In & Sign Up */
            <div className="flex items-center gap-2">
              <Link
                to="/auth/signin"
                className="px-3 py-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="spread-btn-primary px-3.5 py-1.5 text-xs font-bold rounded-full shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default memo(MainNavBar);
