import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { setMenuOpen } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/functions/userImageSrc";
import useIcons from "../../hooks/useIcons";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import spreadLogo from "/spread_logo_03_robopus.png";
import LinkBtn from "../LinkBtn";

const LoginMenuLinks = [
  { id: "feed", icon1: "homeO", icon2: "homeFi", stub: "/", lkname: "Feed" },
  { id: "search", icon1: "searchO", icon2: "search", stub: "/search", lkname: "Search" },
  { id: "write", icon1: "fetherO", icon2: "fetherFi", stub: "/write", lkname: "Write" },
  { id: "saved", icon1: "libraryO", icon2: "libraryFi", stub: "/saved", lkname: "Saved" },
  { id: "messages", icon1: "message", icon2: "messageFi", stub: "/messages", lkname: "Conversations" },
  { id: "settings", icon1: "gearO", icon2: "gearFi", stub: "/setting", lkname: "Settings" },
];

function SideBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { menuOpen } = useSelector((state) => state.ui);
  const { pathname } = useLocation();
  const { userImageurl } = userImageSrc(user);
  const icons = useIcons();

  const isActiveLink = useCallback(
    (stub) => (stub === "/" ? pathname === "/" : pathname.startsWith(stub)),
    [pathname],
  );

  const closeMenu = useCallback(() => dispatch(setMenuOpen()), [dispatch]);

  return (
    <aside
      onClick={closeMenu}
      className={`fixed sm:static left-0 top-0 h-full w-full sm:w-auto z-50 xl:z-30
        border-r border-stone-200/80 dark:border-stone-800/80 bg-black/40 backdrop-blur-xs
        transition-opacity duration-200 ease-in-out
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col justify-between items-center h-full bg-[#faf7f2] dark:bg-[#0c0c0e]
          transition-transform duration-200 ease-in-out sm:rounded-none rounded-r-2xl overflow-hidden xl:p-4 sm:px-3 px-4 py-5
          ${menuOpen ? "animate-slide-in-left sm:animate-none w-fit xl:w-[260px]" : "animate-slide-out-left sm:animate-none w-fit xl:w-fit"}
        `}
      >
        {/* Top Header: Logo & Primary Nav */}
        <div className="flex flex-col w-full gap-5">
          {/* Spread Brand Logo */}
          <div className="flex items-center justify-between px-2">
            <Link
              to="/"
              className="flex items-center gap-3 group transition-transform active:scale-95"
            >
              <ProfileImage
                className="w-8 h-8 rounded-lg object-contain"
                image={spreadLogo}
                alt="Spread Logo"
                disabled
              />
              <span className="font-extrabold tracking-tight text-lg text-stone-900 dark:text-stone-100 xl:block sm:hidden block">
                Spread
              </span>
            </Link>

            {/* Collapse / Close Button */}
            <button
              className="xl:hidden block text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 p-1.5 rounded-lg cursor-pointer"
              onClick={closeMenu}
              aria-label="Close sidebar"
            >
              {icons.close}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 w-full" aria-label="Main navigation">
            {LoginMenuLinks.map((link) => {
              const active = isActiveLink(link.stub);
              return (
                <LinkBtn
                  key={link.id}
                  stub={link.stub}
                  className={`group flex items-center gap-3.5 rounded-xl w-full px-3.5 py-2.5 text-xs sm:text-[13px] font-medium transition-all focus-ring ${
                    active
                      ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60"
                  }`}
                >
                  <div className="flex justify-center items-center w-5 h-5 text-base shrink-0">
                    {icons[active ? link.icon2 : link.icon1]}
                  </div>

                  <span className="xl:block sm:hidden block truncate">
                    {link.lkname}
                  </span>
                </LinkBtn>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Capsule & Logout */}
        <div className="w-full pt-4 border-t border-stone-200/70 dark:border-stone-800/70 space-y-2">
          {user && (
            <Link
              to={user?.profileLink || `/profile/@${user.username}/${user.id}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors w-full group"
            >
              <div className="relative shrink-0">
                <ProfileImage
                  className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800 object-cover"
                  image={userImageurl}
                  alt={user?.username}
                  title="user profile"
                  disabled
                />
              </div>

              <div className="xl:block sm:hidden block flex-1 min-w-0 text-left">
                <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate group-hover:underline">
                  {user.displayName || user.username}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  @{user.username}
                </p>
              </div>
            </Link>
          )}

          <LogoutBtn className="text-xs flex items-center gap-3 px-3.5 py-2 w-full rounded-xl text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer font-medium" />
        </div>
      </div>
    </aside>
  );
}

export default SideBar;

