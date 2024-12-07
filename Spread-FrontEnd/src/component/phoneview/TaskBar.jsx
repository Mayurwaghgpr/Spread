import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
function TaskBar() {
  const { user, isLogin } = useSelector((state) => state.auth);
  const location = useLocation();
  const LoginMenuLinks = [
    {
      id: uuidv4(),
      icon: <i className="bi bi-house"></i>,
      stub: "/",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-search"></i>,
      stub: "/explore",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-feather"></i>,
      stub: "/write",
      className: "text-3xl",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-book"></i>,
      stub: "/read",
    },
    {
      id: uuidv4(),
      icon: <i className="bi bi-person"></i>,
      stub: `/profile/@${user?.username?.replace(/\s+/g, "")}/${user?.id}`,
    },
    ,
  ];
  return (
    <div className=" fixed -bottom-[.15rem]  p-2 justify-center text-2xl items-center gap-4 bg-white dark:bg-black  border-inherit border-t w-full lg:hidden flex dark:bg-opacity-50 dark:backdrop-blur-lg bg-opacity-50 backdrop-blur-lg">
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
                `flex ${isActive && "text-slate-500 dark:text-gray-600 text-opacity-20  dark:bg-opacity-20"} hover:text-slate-500 dark:hover:text-gray-600`
              }
              to={link.stub}
            >
              {link.icon}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default TaskBar;
