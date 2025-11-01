import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { setMenuOpen } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/userImageSrc";
import useIcons from "../../hooks/useIcons";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import { v4 as uuidv4 } from "uuid";
import LinkBtn from "../LinkBtn";

const LoginMenuLinks = [
  {
    id: uuidv4(),
    icon1: "homeO",
    icon2: "homeFi",
    stub: "/",
    lkname: "home",
  },
  {
    id: uuidv4(),
    icon1: "searchO",
    icon2: "search",
    stub: "/search",
    lkname: "search",
  },
  // {
  //   id: uuidv4(),
  //   icon1: "bellO",
  //   icon2: "bellFi",
  //   stub: "/notifications",
  //   lkname: "notifications",
  // },
  {
    id: uuidv4(),
    icon1: "fetherO",
    icon2: "fetherFi",
    stub: "/write",
    className: "text-3xl",
    lkname: "write",
  },
  {
    id: uuidv4(),
    lkname: "Saved",
    icon1: "libraryO",
    icon2: "libraryFi",
    stub: "/saved",
  },
  {
    id: uuidv4(),
    lkname: "Conversation",
    icon1: "message",
    icon2: "messageFi",
    stub: "/messages",
  },
  {
    id: uuidv4(),
    lkname: "settings",
    icon1: "gearO",
    icon2: "gearFi",
    stub: "/setting",
  },
];

function SideBar() {
  const { user } = useSelector((state) => state.auth);
  const { menuOpen } = useSelector((state) => state.ui);
  const location = useLocation();
  const dispatch = useDispatch();
  const { pathname } = location;
  const { userImageurl } = userImageSrc(user);
  const icons = useIcons();

  const isActiveLink = (stub) => {
    if (stub === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(stub);
  };
  const manulProfileLink = useMemo(
    () => `profile/@${user.username}/${user.id}`,
    [user.username, user.id]
  );

  return (
    <aside
      onClick={() => dispatch(setMenuOpen())}
      className={`fixed sm:static left-0 top-0 h-full w-full sm:w-auto z-50 xl:z-30
    transition-all duration-500  ease-in-out
    border-r border-inherit bg-dark/40 backdrop-blur-[1px]
    ${menuOpen ? "opacity-100  pointer-events-auto" : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"}
  `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col justify-between items-center h-full bg-laccent dark:bg-daccent 
      transition-all duration-500 z-30 delay-0 opacity-100 ease-in-out sm:rounded-none rounded-r-2xl overflow-hidden xl:p-0 sm:px-3 pr-10 pl-5
      pb-10
      ${menuOpen ? " animate-slide-in-left sm:animate-none w-fit xl:w-[280px]" : " animate-slide-out-left sm:animate-none w-fit xl:w-[0px]"}
    `}
      >
        <div className="flex flex-col justify-center items-center gap-4 pt-2 w-fit">
          {/* Profile Link */}
          <div className="flex  items-center justify-start gap-2 h-fit w-fit">
            <Link
              to={user?.profileLink || manulProfileLink}
              className="group flex justify-center sm:justify-center items-center gap-3 w-full px-4 py-3 hover:bg-gradient-to-r  rounded-2xl transition-all duration-200 "
            >
              <div className="relative">
                <ProfileImage
                  className=" h-5 w-5 ring-2 rounded-full ring-gray-200 dark:ring-slate-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200"
                  image={userImageurl}
                  alt={user?.username}
                  title="user profile"
                  disabled
                />{" "}
              </div>
              <div className="xl:block sm:hidden block text-nowrap text-xs">
                <h1 className=" transition-colors duration-200">
                  {user?.displayName}
                </h1>
                <p className=" text-gray-500 dark:text-gray-400 xl:block hidden">
                  @{user?.username}
                </p>
              </div>
            </Link>

            <button
              className="xl:block hidden text-xl"
              onClick={() => dispatch(setMenuOpen())}
            >
              {icons["doubleArrowL"]}
            </button>
          </div>

          {LoginMenuLinks.map((link) => (
            <LinkBtn
              key={link.id}
              stub={link.stub}
              className={`group flex lg:justify-start text-sm justify-start sm:justify-center items-center gap-4 rounded-2xl w-full px-4 py-3 no-underline capitalize transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ${
                isActiveLink(link.stub)
                  ? "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-800/40 dark:to-slate-700/40"
                  : "  "
              }`}
              to={link.stub}
            >
              <div
                className={` transition-all duration-200 ${
                  isActiveLink(link.stub)
                    ? " scale-110"
                    : "group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                }`}
              >
                {icons[isActiveLink(link.stub) ? link.icon2 : link.icon1]}
              </div>
              <div className="xl:block sm:hidden block">
                <span
                  className={` transition-all duration-200 ${
                    isActiveLink(link.stub) ? " font-semibold" : ""
                  }`}
                >
                  {link.lkname}
                </span>
              </div>
            </LinkBtn>
          ))}
          <LogoutBtn className="group text-sm flex justify-start items-center gap-4 px-4 py-3 w-full  text-nowrap no-underline rounded-2xl transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-[1.02] hover:shadow-md" />
        </div>

        {/* Logout Button */}
      </div>
    </aside>
  );
}

export default SideBar;
