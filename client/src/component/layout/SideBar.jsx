import React from "react";
import { Link, useLocation } from "react-router-dom";
import { setManuOpen } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/userImageSrc";
import useIcons from "../../hooks/useIcons";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import { v4 as uuidv4 } from "uuid";
import AbbreviateNumber from "../../utils/AbbreviateNumber";
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
    lkname: "read",
    icon1: "libraryO",
    icon2: "libraryFi",
    stub: "/read",
  },
  {
    id: uuidv4(),
    lkname: "messages",
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
  const { MenuOpen } = useSelector((state) => state.ui);
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

  return (
    <aside
      onClick={() => dispatch(setManuOpen())}
      className={`sm:static fixed left-0 top-0 w-full sm:block h-screen sm:w-fit transition-all duration-300 ease-in-out border-r sm:z-30 z-40 lg:animate-none animate-fedin.2s overflow-hidden ${
        !MenuOpen && "hidden"
      } ${
        pathname.startsWith("/view") && "sm:hidden"
      } dark:border-slate-700/50 border-gray-200/80 bg-light dark:bg-dark backdrop-blur-xl sm:bg-light sm:dark:bg-dark sm:backdrop-blur-sm`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between h-full sm:min-w-full w-fit me-16 px-6 py-8 sm:dark:bg-transparent bg-light dark:bg-dark xl:bg-inherit animate-slide-in-left sm:animate-none xl:text-xl sm:text-lg shadow-2xl sm:shadow-none dark:shadow-black/20 backdrop-blur-sm sm:backdrop-blur-none"
      >
        <div className="flex flex-col justify-center items-center gap-6 w-fit sm:mt-8">
          {/* Profile Link */}
          <div className="flex flex-col gap-6 h-fit w-full">
            <Link
              to={`/profile/@${user?.username}/${user?.id}`}
              className="group flex justify-center items-center gap-3 w-full px-4 py-3 hover:bg-gradient-to-r  rounded-2xl transition-all duration-200 "
              onClick={() => dispatch(setManuOpen())}
            >
              <div className="relative">
                <ProfileImage
                  className="xl:w-12 xl:h-12 h-10 w-10 ring-2 rounded-full ring-gray-200 dark:ring-slate-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200"
                  image={userImageurl}
                  alt={user?.username}
                  title="user profile"
                  disabled
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 xl:block hidden"></div>
              </div>
              <div className="xl:block sm:hidden block text-nowrap">
                <h1 className="font-semibold  transition-colors duration-200">
                  {user?.displayName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 xl:block hidden">
                  @{user?.username}
                </p>
              </div>
            </Link>

            <div className="xl:flex justify-center items-center sm:hidden flex gap-6 text-sm bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-gray-900 dark:text-white">
                  <AbbreviateNumber rawNumber={user?.Followers?.length || 0} />
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Followers
                </span>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-slate-600"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-gray-900 dark:text-white">
                  <AbbreviateNumber rawNumber={user?.Following?.length || 0} />
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </div>
            </div>
          </div>

          {LoginMenuLinks.map((link) => (
            <LinkBtn
              key={link.id}
              stub={link.stub}
              className={`group flex lg:justify-start justify-center items-center gap-4 rounded-2xl w-full px-4 py-3 no-underline capitalize transition-all duration-200 hover:scale-[1.02] ${
                isActiveLink(link.stub)
                  ? "shadow-lg "
                  : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
              }`}
              to={link.stub}
              onClick={() => dispatch(setManuOpen())}
            >
              <div
                className={`text-xl transition-all duration-200 ${
                  isActiveLink(link.stub)
                    ? " scale-110"
                    : "group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                }`}
              >
                {icons[isActiveLink(link.stub) ? link.icon2 : link.icon1]}
              </div>
              <div className="xl:block sm:hidden block">
                <span
                  className={`font-medium transition-all duration-200 ${
                    isActiveLink(link.stub) ? " font-semibold" : ""
                  }`}
                >
                  {link.lkname}
                </span>
              </div>
            </LinkBtn>
          ))}
        </div>

        {/* Logout Button */}
        <div className="w-fit">
          <LogoutBtn className="group flex justify-start items-center gap-4 px-4 py-3 no-underline rounded-2xl transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-[1.02] hover:shadow-md" />
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
