import React, {
  useState,
  useRef,
  memo,
  Suspense,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profileIcon from "/ProfOutlook.png";
import useClickOutside from "../../hooks/useClickOutside";
import ProfileButton from "../ProfileButton";
// import useScrollDirection from "../../hooks/useScrollDirection"; // Import the custom hook

const ConfirmationBox = React.lazy(
  () => import("../UtilityComp/ConfirmationBox")
);

import SearchBar from "../homeComp/searchBar";
import ThemeMenu from "../UtilityComp/ThemeMenu";
import ThemeBtn from "../buttons/ThemeBtn";
import { setManuOpen } from "../../redux/slices/uiSlice";

function MainNavBar() {
  // const { NavetransformY } = useScrollDirection();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchRef = useRef();

  const { confirmBox, ThemeMode, MenuOpen } = useSelector((state) => state.ui);
  const { isLogin, user } = useSelector((state) => state.auth);

  return (
    <header
      className={`fixed top-0   flex justify-center w-full transform-all duration-300 ease-in-out z-40`}
    >
      <nav
        className={`relative  w-full py-3 sm:px-20 px-10 bg-inherit dark:bg-black dark:border-[#383838] border-b  border-inherit dark:bg-opacity-50 dark:backdrop-blur-lg bg-opacity-50 backdrop-blur-lg `}
      >
        <div className="flex border-inherit items-center justify-between w-full m-auto">
          <Link to="/" className="text-2xl font-bold ">
            Spread
          </Link>

          <div className="flex gap-8 justify-end items-center border-inherit ">
            <ThemeBtn />
            {isLogin && (
              <div className="relative sm:text-xl">
                <i className="bi bi-bell"></i>
                <span className="absolute top-0 flex h-3 w-3 -right-1">
                  <span className="animate-ping absolute inline-flex h-[6px] w-[6px] rounded-full bg-slate-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-slate-500"></span>
                </span>
              </div>
            )}

            {isLogin ? (
              <div className="relative box-content flex *:transition-all *:duration-300 text-left group border-inherit">
                <ProfileButton
                  onClick={() => dispatch(setManuOpen())}
                  className={`box-content border-2  size-10 ${
                    location.pathname.startsWith("/profile")
                      ? " border-black"
                      : "border-transparent"
                  } `}
                />
                {/* Tooltip with user name */}
                {!MenuOpen && (
                  <span
                    className="pointer-events-none  opacity-0 p-1 rounded-lg absolute -bottom-9 left-1/2 bg-[#e8e4df] shadow-xl dark:bg-black border border-inherit -translate-x-1/2 w-32 text-center
      group-hover:opacity-100"
                  >
                    {user.username}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex gap-3 border-inherit justify-end w-full items-center sm:text-sm text-xs">
                <Link to="/auth/signin" className=" rounded-3xl sm:px-3 py-2">
                  SignIn
                </Link>
                <Link
                  to="/auth/signup"
                  className="border border-inherit rounded-full px-3 py-1"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default memo(MainNavBar);
