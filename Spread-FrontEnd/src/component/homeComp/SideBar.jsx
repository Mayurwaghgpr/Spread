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
import Theme from "../otherUtilityComp/ThemeMenu";

function SideBar() {
  const { user, isLogin } = useSelector((state) => state.auth);
  const { MenuOpen } = useSelector((state) => state.ui);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userImageurl } = userImageSrc(user);

  const { mutate, isLoading } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      dispatch(setIsLogin(false));
      dispatch(setUser(null));

      localStorage.removeItem("AccessToken"); //if it is stored in localStorage
      localStorage.removeItem("userAccount"); //if it is stored in localStorage
      navigate("/");
    },
    onError: () => {
      <SomthingWentWrong />;
    },
  });

  if (isLoading) {
    <LoaderScreen />;
  }

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
      icon: <i className="bi bi-feather"></i>,
      stub: "/write",
      className: "text-3xl",
      lkname: "Write",
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
      stub: "stories",
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
      className={`fixed border-r z-40 animate-slide-in-left sm:animate-none ${!MenuOpen && "hidden"}  *:transition-all  *:duration-100 dark:*:border-[#383838] lg:block  w-full lg:w-fit left-0 top-0 lg:top-[4.2rem] h-screen    bg-gray-500 bg-opacity-10 backdrop-blur-[.8px] lg:bg-white dark:border-[#383838]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-10  w-fit dark:bg-black bg-white h-full  text-xl"
      >
        <div className="flex flex-col gap-7 text-gray-700 dark:text-white *:transition-all *:duration-300 sm:w-full justify-center  items-center ">
          {/* Profile Link */}
          {LoginMenuLinks.map((link) => {
            return (
              <NavLink
                key={link.id}
                isActive={(match, location) =>
                  location.pathname.startsWith(link.stub)
                }
                className={({ isActive }) =>
                  `flex ${isActive && "text-slate-500  dark:text-gray-600 text-opacity-40  dark:text-opacity-40"} px-3 py-1 justify-start items-center   hover:text-slate-500 dark:hover:text-gray-600  dark:hover:bg-opacity-30 rounded-md  gap-5 w-full`
                }
                to={link.stub}
              >
                {link.icon}
                <div className={`xl:flex flex-col hidden  `}>
                  {" "}
                  <span>{link.lkname}</span>{" "}
                </div>
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={mutate}
            type="button"
            aria-label="Logout"
            className="flex gap-5 items-center w-full hover:bg-opacity-5 px-3 py-1 rounded-md"
          >
            <LuLogOut className="" />
            <span className=" xl:block   hidden ">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
