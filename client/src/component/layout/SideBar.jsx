import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
    lkname: "read ",
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
  const { pathname } = useLocation();
  const { userImageurl } = userImageSrc(user);
  const icons = useIcons();

  return (
    <aside
      onClick={(e) => {
        dispatch(setManuOpen());
      }}
      className={`sm:static fixed left-0 top-0 w-full sm:block h-screen sm:w-fit *:transition-all *:duration-200 border-r sm:z-30 z-40 lg:animate-none animate-fedin.2s overflow-hidden ${!MenuOpen && "hidden"} ${pathname.startsWith("/view") && "sm:hidden"}  *:transition-all  *:duration-100 dark:*:border-[#383838] bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-30 backdrop-blur-[1px]  sm:bg-light sm:dark:bg-dark dark:border-[#383838]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between h-full sm:min-w-full w-fit me-16 p-10  sm:dark:bg-transparent  bg-light dark:bg-dark  xl:bg-inherit animate-slide-in-left sm:animate-none xl:text-xl sm:text-lg  shadow-md dark:shadow-gray-100 "
      >
        <div className="flex flex-col justify-center items-center gap-4 w-fit sm:mt-16">
          {/* Profile Link */}
          <div className=" flex flex-col gap-4 h-fit w-full ">
            <Link
              to={`/profile/@${user?.username?.replace(/\s+/g, "")}/${user?.id}`}
              className="flex justify-center items-center gap-2 w-full p-3 hover:bg-gray-400  hover:bg-opacity-15 rounded-full "
              onClick={() => dispatch(setManuOpen())}
            >
              <ProfileImage
                className={"xl:w-10 xl:h-10 h-8 w-8"}
                image={userImageurl}
                alt={user?.username}
                title={"user profile"}
                disabled
              />
              <h1 className=" xl:block sm:hidden block text-nowrap">
                {user?.displayName}
              </h1>
            </Link>
            {/* <h2 className="text-xs px-3 dark:text-white  text-[#222222] dark:opacity-50 text-opacity-40">
            
                {user.email}
              </h2> */}
            <div className="xl:flex justify-start items-center sm:hidden flex gap-3 text-sm  dark:text-white  text-[#222222] dark:opacity-50 text-opacity-20">
              <div>
                <AbbreviateNumber rawNumber={user?.Followers?.length} />{" "}
                Followers
              </div>
              <div>
                <AbbreviateNumber rawNumber={user?.Following?.length} />{" "}
                Following
              </div>
            </div>
          </div>
          {LoginMenuLinks.map((link) => {
            return (
              <LinkBtn
                key={link.id}
                stub={link.stub}
                className={`flex  justify-start items-center p-3 no-underline capitalize  hover:bg-gray-400  hover:bg-opacity-15 rounded-full  gap-5 w-full`}
                to={link.stub}
                onClick={() => dispatch(setManuOpen())}
              >
                {
                  icons[
                    location?.pathname?.startsWith(link.stub)
                      ? link.icon2
                      : link.icon1
                  ]
                }
                <div className={`xl:block sm:hidden block flex-col `}>
                  {" "}
                  <span>{link.lkname}</span>{" "}
                </div>
              </LinkBtn>
            );
          })}
        </div>
        {/* Logout Button */}
        <div className="w-fit">
          {" "}
          <LogoutBtn className="flex  justify-start  items-center gap-5 p-3 no-underline opacity-50 hover:opacity-100  hover:bg-gray-400  hover:bg-opacity-15 rounded-full " />
        </div>
      </div>
    </aside>
  );
}
export default SideBar;
