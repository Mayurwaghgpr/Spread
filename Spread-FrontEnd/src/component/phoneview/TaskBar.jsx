import React from "react";
import { BsPeople } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import {
  IoHomeOutline,
  IoHomeSharp,
  IoLibraryOutline,
  IoLibrarySharp,
  IoPeople,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import { PiPerson } from "react-icons/pi";
import { RiQuillPenFill, RiQuillPenLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
function TaskBar() {
  const { user, isLogin } = useSelector((state) => state.auth);
  const location = useLocation();
  const LoginMenuLinks = [
    {
      id: uuidv4(),
      icon1: <IoHomeOutline />,
      icon2: <IoHomeSharp />,
      stub: "/",
    },
    {
      id: uuidv4(),
      icon1: <IoSearchOutline />,
      icon2: <IoSearch />,
      stub: "/explore",
    },
    {
      id: uuidv4(),
      icon1: <RiQuillPenLine />,
      icon2: <RiQuillPenFill />,
      stub: "/write",
      className: "text-4xl",
    },
    {
      id: uuidv4(),
      icon1: <IoLibraryOutline />,
      icon2: <IoLibrarySharp />,
      stub: "/read",
    },
    {
      id: uuidv4(),
      icon1: <IoIosPeople />,
      icon2: <IoIosPeople />,
      stub: `/peoples`,
    },
    ,
  ];
  return (
    <div className=" fixed -bottom-[.15rem]  py-2  justify-center text-2xl items-center gap-4 bg-white dark:bg-black  border-inherit border-t w-full lg:hidden flex dark:bg-opacity-50 dark:backdrop-blur-lg bg-opacity-50 backdrop-blur-lg">
      <div className=" flex justify-around items-center w-full ">
        {" "}
        {LoginMenuLinks.map((link) => {
          return (
            <NavLink
              key={link.id}
              isActive={(match, location) =>
                location.pathname.startsWith(link.stub)
              }
              className={({ isActive }) =>
                `flex ${link.className} ${isActive ? " text-opacity-100  dark:bg-opacity-100" : " text-opacity-20  dark:bg-opacity-20"} text-black dark:text-white`
              }
              to={link.stub}
            >
              {location.pathname.startsWith(link.stub)
                ? link?.icon2
                : link.icon1}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default TaskBar;
