import React, { Fragment, memo, useCallback, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/userImageSrc";
import { v4 as uuidv4 } from "uuid";
import { LuLogOut } from "react-icons/lu";
import { setManuOpen } from "../../redux/slices/uiSlice";
import { useMutation } from "react-query";
import { Logout } from "../../Apis/authapi";
import SomthingWentWrong from "../../pages/ErrorPages/somthingWentWrong";
import LoaderScreen from "../loaders/loaderScreen";
import { setIsLogin, setUser } from "../../redux/slices/authSlice";
import Theme from "../UtilityComp/ThemeMenu";
import { createPortal } from "react-dom";
import abbreviateNumber from "../../utils/numAbrivation";
import {
  IoHomeOutline,
  IoHomeSharp,
  IoLibrarySharp,
  IoSadOutline,
  IoSadSharp,
  IoSearch,
  IoSearchOutline,
  IoSearchSharp,
} from "react-icons/io5";
import { BsFeather, BsGear, BsGearFill, BsSearch } from "react-icons/bs";
import { FaFeather } from "react-icons/fa6";
import { RiQuillPenFill, RiQuillPenLine } from "react-icons/ri";
import { IoLibraryOutline } from "react-icons/io5";
import { TbMessageCircle, TbMessageCircleFilled } from "react-icons/tb";
const LoginMenuLinks = [
  {
    id: uuidv4(),
    icon1: <IoHomeOutline />,
    icon2: <IoHomeSharp />,
    stub: "/",
    lkname: "home",
  },

  {
    id: uuidv4(),
    icon1: <IoSearchOutline />,
    icon2: <IoSearch />,
    stub: "/explore",
    lkname: "explore",
  },
  {
    id: uuidv4(),
    icon1: <RiQuillPenLine />,
    icon2: <RiQuillPenFill />,
    stub: "/write",
    className: "text-3xl",
    lkname: "write",
  },
  {
    id: uuidv4(),
    lkname: "read ",
    icon1: <IoLibraryOutline />,
    icon2: <IoLibrarySharp />,
    stub: "/read",
  },

  {
    id: uuidv4(),
    lkname: "messages",
    icon1: <TbMessageCircle />,
    icon2: <TbMessageCircleFilled />,
    stub: "/messages",
  },

  {
    id: uuidv4(),
    lkname: "settings",
    icon1: <BsGear />,
    icon2: <BsGearFill />,
    stub: "/setting",
  },
];
function SideBar({ className }) {
  const { user, isLogin } = useSelector((state) => state.auth);
  const { MenuOpen } = useSelector((state) => state.ui);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { userImageurl } = userImageSrc(user);

  const { mutate, isLoading } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      localStorage.removeItem("AccessToken"); //if it is stored in localStorage
      localStorage.removeItem("userAccount"); //if it is stored in localStorage
      dispatch(setIsLogin(false));
      dispatch(setUser(null));

      navigate("/");
    },
    onError: () => {
      <SomthingWentWrong />;
    },
  });

  if (isLoading) {
    <LoaderScreen />;
  }
  return (
    <div
      onClick={(e) => {
        dispatch(setManuOpen());
      }}
      className={`fixed *:transition-all *:duration-200 border-r md:z-30 z-40 md:animate-none animate-fedin.2s overflow-hidden ${!MenuOpen && "hidden"} ${pathname.startsWith("/view") && "md:hidden"}  *:transition-all  *:duration-100 dark:*:border-[#383838] md:block w-full md:w-fit left-0 top-0  h-screen   backdrop-blur-[1px] xl:bg-[#f3efeb] dark:md:bg-black dark:border-[#383838]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="xl:p-10 sm:ps-8 sm:py-8 sm:pe-4 w-fit sm:mt-16  p-8 sm:dark:bg-transparent sm:bg-transparent dark:bg-black bg-[#fff9f3] lg:dark:bg-black animate-slide-in-left md:animate-none xl:text-xl text-2xl lg:bg-[#fff9f3] h-full shadow-sm"
      >
        <div className="w-fit flex flex-col items-start justify-between  px-3 gap-7 min-h-[90%] text-black dark:text-white *:transition-all *:duration-300 ">
          <div className="flex flex-col gap-4">
            {/* Profile Link */}
            <div className=" flex flex-col gap-2 h-fit ">
              <Link
                to={`/profile/@${user?.username?.replace(/\s+/g, "")}/${user?.id}`}
                className="flex justify-start items-center gap-3  hover:bg-gray-400  hover:bg-opacity-15 rounded-full p-3"
                onClick={() => dispatch(setManuOpen())}
              >
                <div className="size-10  ">
                  {" "}
                  <img
                    className="h-full w-full rounded-full object-cover object-top"
                    src={userImageurl}
                    alt="User profile"
                  />
                </div>{" "}
                <h1 className=" xl:block sm:hidden block text-nowrap">
                  {user?.displayName}
                </h1>
              </Link>
              {/* <h2 className="text-xs px-3 dark:text-white  text-[#222222] dark:opacity-50 text-opacity-40">
            
                {user.email}
              </h2> */}
              <div className="xl:flex justify-start items-center sm:hidden flex gap-3 text-sm  px-3 dark:text-white  text-[#222222] dark:opacity-50 text-opacity-20">
                <h3>
                  {abbreviateNumber(user?.Followers?.length) || 0} Followers
                </h3>
                <h4>
                  {abbreviateNumber(user?.Following?.length) || 0} Following
                </h4>
              </div>
            </div>
            {LoginMenuLinks.map((link) => {
              return (
                <NavLink
                  key={link.id}
                  isActive={(match, location) =>
                    location.pathname.startsWith(link.stub)
                  }
                  className={({ isActive }) =>
                    `flex ${isActive && "font-bold "} capitalize  justify-start items-center p-3   hover:bg-gray-400  hover:bg-opacity-15 rounded-full  gap-5 w-full`
                  }
                  to={link.stub}
                  onClick={() => dispatch(setManuOpen())}
                >
                  {location.pathname.startsWith(link.stub)
                    ? link.icon2
                    : link.icon1}
                  <div className={`xl:block sm:hidden block flex-col `}>
                    {" "}
                    <span>{link.lkname}</span>{" "}
                  </div>
                </NavLink>
              );
            })}
          </div>
          {/* Logout Button */}
          <div className=" ">
            {" "}
            <button
              onClick={mutate}
              type="button"
              aria-label="Logout"
              className="flex gap-5 items-center  hover:bg-opacity-5 px-3  rounded-md"
            >
              <LuLogOut className="" />
              <span className=" xl:block sm:hidden block ">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SideBar;
