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
  return createPortal(
    <div
      onClick={(e) => {
        dispatch(setManuOpen());
      }}
      className={`fixed border-r z-40 sm:animate-none animate-fedin.2s ${!MenuOpen && "hidden"}  *:transition-all  *:duration-100 dark:*:border-[#383838] xl:block w-full xl:w-fit left-0 top-0 xl:top-[4.1rem] h-screen  bg-[#f3efeb] bg-opacity-10 backdrop-blur-[.5px] xl:bg-[#f3efeb] dark:xl:bg-black dark:border-[#383838]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-10 w-fit dark:bg-black animate-slide-in-left xl:animate-none   bg-[#f3efeb] h-full"
      >
        <div className="flex flex-col min-h-[90%] text-black text-lg dark:text-white *:transition-all *:duration-300 sm:w-full justify-between  items-center ">
          {/* Profile Link */}
          <div className="flex flex-col gap-2">
            {LoginMenuLinks.map((link) => {
              return (
                <NavLink
                  key={link.id}
                  isactive={(match, location) =>
                    location.pathname.startsWith(link.stub)
                  }
                  className={({ isActive }) =>
                    `flex ${isActive && "font-extrabold text-xl "} px-3  justify-start items-center   hover:bg-gray-400  hover:bg-opacity-15 rounded-full  p-3 gap-5 w-full`
                  }
                  to={link.stub}
                >
                  {link.icon}
                  <div className={`xl:block sm:hidden block flex-col `}>
                    {" "}
                    <span>{link.lkname}</span>{" "}
                  </div>
                </NavLink>
              );
            })}
          </div>
          {/* Logout Button */}
          <button
            onClick={mutate}
            type="button"
            aria-label="Logout"
            className="flex gap-5 items-center w-full hover:bg-opacity-5 px-3 py-1 rounded-md"
          >
            <LuLogOut className="" />
            <span className=" xl:block sm:hidden block ">Sign out</span>
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default SideBar;
