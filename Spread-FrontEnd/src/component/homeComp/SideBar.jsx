import React, { Fragment, memo, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../utils/logout";
import userImageSrc from "../../utils/userImageSrc";
import { v4 as uuidv4 } from "uuid";
import { LuLogOut } from "react-icons/lu";
import { setManuOpen } from "../../redux/slices/uiSlice";

function SideBar() {
  const { user, isLogin } = useSelector((state) => state.auth);
  const { MenuOpen } = useSelector((state) => state.ui);
  const Logout = useLogout();
  const location = useLocation();
  const navigat = useNavigate();
  const dispatch = useDispatch();
  const { userImageurl } = userImageSrc(user);
  const LoginMenuLinks = [
    {
      id: uuidv4(),
      lkname: user?.username,
      icon: (
        <img
          className="size-8 rounded-full object-cover object-top"
          src={userImageurl}
          alt="User profile"
        />
      ),
      stub: `/profile/@${user?.username?.replace(/\s+/g, "")}/${user?.id}`,
      email: user.email,
      className: "text-sm",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-house"></i>,
      stub: "/",
      lkname: "Home",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-search"></i>,
      stub: "/explore",
      lkname: "Explore",
    },
    {
      id: uuidv4(),
      lkname: "Read",
      icon: <i className="bi bi-book"></i>,
      stub: "/read",
    },

    {
      id: uuidv4(),
      lkname: "Stories",
      icon: <i className="bi bi-hourglass"></i>,
      stub: "",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-feather"></i>,
      stub: "/write",
      className: "text-3xl",
      lkname: "Write",
    },
    {
      id: uuidv4(),
      lkname: "Settings",
      icon: <i className="bi bi-gear"></i>,
      stub: "/setting",
    },
  ];
  return (
    <div
      onClick={(e) => {
        dispatch(setManuOpen());
      }}
      className={`fixed border-r z-50 animate-slide-in-left sm:animate-none ${!MenuOpen && "hidden"}  *:transition-all  *:duration-100 dark:*:border-[#383838] lg:block  w-full lg:w-fit left-0 top-0 lg:top-[4.3rem] h-screen    bg-gray-500 bg-opacity-10 backdrop-blur-[.8px] lg:bg-white dark:border-[#383838] dark:border`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-10  w-fit dark:bg-black bg-white h-full sm:text-2xl text-xl"
      >
        <div className="flex flex-col gap-7 text-gray-700 *:transition-all *:duration-300 sm:w-full justify-center  items-center ">
          {/* Profile Link */}
          {LoginMenuLinks.map((link) => {
            return (
              <Link
                key={link.id}
                className={`flex ${location.pathname.startsWith(link.stub) && " text-black"} px-3 py-1 justify-start items-center hover:bg-opacity-5  hover:bg-slate-500 dark:hover:bg-gray-600  rounded-md  gap-5 w-full`}
                to={link.stub}
              >
                {link.icon}
                <div className={`xl:flex flex-col  `}>
                  {" "}
                  <span>{link.lkname}</span>{" "}
                </div>
              </Link>
            );
          })}
          {/* Logout Button */}
          <button
            onClick={Logout}
            type="button"
            aria-label="Logout"
            className="flex gap-5 items-center w-full hover:bg-opacity-5 px-3 py-1  hover:bg-slate-500 dark:hover:bg-gray-600 rounded-md"
          >
            <LuLogOut className="" />
            <span className=" xl:block ">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
