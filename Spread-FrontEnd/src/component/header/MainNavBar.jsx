import React, { useRef, memo, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProfileButton from "../ProfileButton";
// import useScrollDirection from "../../hooks/useScrollDirection"; // Import the custom hook

import ThemeBtn from "../buttons/ThemeBtn";
import { setManuOpen } from "../../redux/slices/uiSlice";
import { BsMoonStarsFill } from "react-icons/bs";
import { IoSunny } from "react-icons/io5";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import LogoutBtn from "../buttons/LogoutBtn";

function MainNavBar() {
  // const { NavetransformY } = useScrollDirection();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { MenuOpen } = useSelector((state) => state.ui);
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);
  const { ThemeMode } = useSelector((state) => state.ui);

  const Modes = useMemo(
    () => [
      {
        name: "Dark mode",
        value: "dark",
        icon: <BsMoonStarsFill />,
      },
      {
        name: "Light mode",
        value: "light",
        icon: <IoSunny />,
      },
      {
        name: "System",
        value: "system",
        icon: <HiOutlineComputerDesktop />,
      },
    ],
    [ThemeMode]
  );

  return (
    <header
      className={`fixed top-0 p-3  sm:px-20 flex justify-center w-full transform-all duration-300 ease-in-out z-40 dark:border-[#383838] border-b  border-inherit  bg-[#fff9f3] dark:bg-black dark:bg-opacity-30 dark:backdrop-blur-lg bg-opacity-10 backdrop-blur-lg`}
    >
      <nav className={`relative  w-full    `}>
        <div className="flex border-inherit items-center justify-between w-full m-auto">
          <Link to="/" className="sm:text-2xl  font-bold ">
            Spread
          </Link>

          <div className="flex w-fit gap-5 justify-end items-center border-inherit ">
            <ThemeBtn Modes={Modes} separate={false} className={"relative"} />
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
              <div className="relative box-content flex  *:transition-all *:duration-300 text-left group border-inherit">
                <ProfileButton
                  onClick={() => dispatch(setManuOpen())}
                  className={`box-content border-2  sm:size-9 size-7  ${
                    location.pathname.startsWith("/profile") &&
                    userProfile?.id === user?.id
                      ? " border-black dark:border-white"
                      : "border-transparent"
                  } `}
                />
                {/* Tooltip with user name */}
                <div className="flex justify-start w-52 flex-col gap-5 pointer-events-none opacity-0 group-hover:pointer-events-auto  group-hover:opacity-100  p-3 rounded-lg absolute top-10 -left-40 bg-[#e8e4df] shadow-xl dark:bg-black border border-inherit  text-nowrap text-center">
                  {" "}
                  <span className="text-sm w-fit">{user.displayName}</span>{" "}
                  <ThemeBtn
                    Modes={Modes}
                    separate={true}
                    className={
                      "relative  w-fit  flex justify-evenly items-center gap-2 bg-[#d4d4d4] dark:bg-[#4a4a4a] *:text-xs *:bg-[#ffffff] *:text-black *:p-1 *:py-0.5  *:flex *:justify-center *:items-center *:rounded-md rounded-md p-1.5"
                    }
                  />{" "}
                  <LogoutBtn className="flex gap-2 items-center  hover:bg-opacity-5 text-sm   rounded-md" />
                </div>
              </div>
            ) : (
              <div className="flex text-nowrap gap-3 border-inherit justify-end w-full items-center sm:text-sm text-xs">
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
