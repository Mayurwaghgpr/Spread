import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { setMenuOpen } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/functions/userImageSrc";
import useIcons from "../../hooks/useIcons";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import { v4 as uuidv4 } from "uuid";
import LinkBtn from "../LinkBtn";

const LoginMenuLinks = [
  { id: uuidv4(), icon1: "homeO", icon2: "homeFi", stub: "/", lkname: "home" },
  {
    id: uuidv4(),
    icon1: "searchO",
    icon2: "search",
    stub: "/search",
    lkname: "search",
  },
  {
    id: uuidv4(),
    icon1: "fetherO",
    icon2: "fetherFi",
    stub: "/write",
    lkname: "write",
    className: "text-3xl",
  },
  {
    id: uuidv4(),
    icon1: "libraryO",
    icon2: "libraryFi",
    stub: "/saved",
    lkname: "Saved",
  },
  {
    id: uuidv4(),
    icon1: "message",
    icon2: "messageFi",
    stub: "/messages",
    lkname: "Conversation",
  },
  {
    id: uuidv4(),
    icon1: "gearO",
    icon2: "gearFi",
    stub: "/setting",
    lkname: "settings",
  },
];

function SideBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { menuOpen } = useSelector((state) => state.ui);
  const { pathname } = useLocation();
  const { userImageurl } = userImageSrc(user);
  const icons = useIcons();

  //Efficient active link checker
  const isActiveLink = useCallback(
    (stub) => (stub === "/" ? pathname === "/" : pathname.startsWith(stub)),
    [pathname],
  );

  // Close menu on overlay click
  const closeMenu = useCallback(() => dispatch(setMenuOpen()), [dispatch]);

  return (
    <aside
      onClick={closeMenu}
      className={`fixed sm:static left-0 top-0 h-full w-full sm:w-auto sm:bg-laccent sm:dark:bg-daccent z-50 xl:z-30
        border-r border-inherit bg-dark/40 backdrop-blur-[1px]
        transition-opacity duration-300 ease-in-out
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col justify-between items-center h-full bg-laccent dark:bg-daccent 
          transition-transform duration-300 ease-in-out sm:rounded-none rounded-r-2xl overflow-hidden xl:p-0 sm:px-3 pr-10 pl-5 pb-10
          ${menuOpen ? "animate-slide-in-left sm:animate-none w-fit xl:w-[280px]" : "animate-slide-out-left sm:animate-none w-fit xl:w-0"}
        `}
      >
        {/* Top Section - Profile + Nav */}
        <div className="flex flex-col justify-between h-full mb-10 items-center gap-4 pt-2 w-fit">
          <div className="flex flex-col w-full h-full gap-4">
            {/* Profile Link */}
            <div className="flex items-center justify-start gap-2 h-fit w-fit">
              <Link
                to={
                  user?.profileLink || `/profile/@${user.username}/${user.id}`
                }
                className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#e8dfd5]/60 dark:hover:bg-[#1f1f1f] focus-ring"
              >
                <div
                  className={`relative ${!userImageurl && "bg-stone-300 dark:bg-stone-700 h-6 w-6 rounded-full"}`}
                >
                  {userImageurl && (
                    <ProfileImage
                      className="h-6 w-6 rounded-full border border-inherit object-cover"
                      image={userImageurl}
                      alt={user?.username}
                      title="user profile"
                      disabled
                    />
                  )}
                </div>

                <div
                  className={`${
                    user?.displayName
                      ? ""
                      : "w-[7rem] bg-stone-300 dark:bg-stone-700 h-4 rounded-lg animate-pulse"
                  } xl:block sm:hidden block text-nowrap text-xs`}
                >
                  {user?.displayName && <h1 className="font-semibold text-stone-900 dark:text-stone-100">{user.displayName}</h1>}
                  {user?.username && (
                    <p className="text-stone-500 dark:text-stone-400 text-[11px] xl:block hidden">
                      @{user.username}
                    </p>
                  )}
                </div>
              </Link>

              {/* Collapse Button */}
              <button
                className="xl:block hidden text-lg text-stone-500 hover:text-stone-900 dark:hover:text-white p-1 rounded-lg focus-ring"
                onClick={() => dispatch(setMenuOpen())}
                aria-label="Close sidebar"
              >
                {icons["doubleArrowL"]}
              </button>
            </div>

            {/* Navigation Links */}

            {LoginMenuLinks.map((link) => {
              const active = isActiveLink(link.stub);
              return (
                <LinkBtn
                  key={link.id}
                  stub={link.stub}
                  className={`group flex items-center gap-4 rounded-xl w-full px-4 py-3 text-sm capitalize transition-all duration-200 focus-ring
                  hover:bg-[#e8dfd5]/60 dark:hover:bg-[#1f1f1f]
                  text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white
                  ${active ? "bg-[#e8dfd5]/90 dark:bg-[#1f1f1f] text-stone-900 dark:text-white font-bold border border-inherit" : ""}
                `}
                >
                  <div
                    className={`transition-all duration-200 flex justify-center items-center w-6 h-6 ${
                      active
                        ? "scale-105"
                        : "group-hover:scale-105"
                    }`}
                  >
                    {icons[active ? link.icon2 : link.icon1]}
                  </div>

                  <div className="xl:block sm:hidden block">
                    <span className={active ? "font-semibold" : ""}>
                      {link.lkname}
                    </span>
                  </div>
                </LinkBtn>
              );
            })}
          </div>
          {/* Logout Button */}
          <LogoutBtn className="group text-sm flex items-center gap-4 px-4 py-3 w-full rounded-xl text-stone-500 dark:text-stone-400 transition-all duration-200 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus-ring" />
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
