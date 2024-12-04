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
  () => import("../otherUtilityComp/ConfirmationBox")
);

import SearchBar from "../homeComp/searchBar";
import ThemeMenu from "../otherUtilityComp/ThemeMenu";
import ThemeBtn from "../buttons/ThemeBtn";

function MainNavBar() {
  // const { NavetransformY } = useScrollDirection();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchRef = useRef();

  const { confirmBox, ThemeMode } = useSelector((state) => state.ui);
  const { isLogin, user } = useSelector((state) => state.auth);

  return (
    <header
      className={`fixed top-0 transform-all duration-300 ease-in-out flex  justify-center w-full z-10`}
    >
      <nav
        className={`relative  z-10 w-full py-3 px-7 sm:px-20 lg:px-28 bg-white dark:border-[#383838] border-b dark:bg-black border-inherit dark:border-[#383838]${
          !isLogin ? " bg-opacity-20 backdrop-blur-lg" : "dark:bg-[#222222] "
        } `}
      >
        <div className="flex items-center justify-between w-full m-auto">
          <Link to="/" className="text-2xl font-bold ">
            Spread
          </Link>

          <div className="flex gap-8 justify-end items-center ">
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
              <div className="relative flex text-left">
                <ProfileButton
                  className={` box-content ${
                    location.pathname.startsWith("/profile")
                      ? "border-2 border-black "
                      : ""
                  }`}
                  profileIcon={profileIcon}
                />
              </div>
            ) : (
              <div className="flex gap-3 justify-end w-full items-center sm:text-lg text-xs">
                <Link to="/auth/signin" className=" rounded-3xl sm:px-3 py-2">
                  SignIn
                </Link>
                <Link
                  to="/auth/signup"
                  className="border border-inherit rounded-full px-3 py-1"
                >
                  get started
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
