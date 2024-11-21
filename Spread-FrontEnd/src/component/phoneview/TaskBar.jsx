import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
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
    <div className=" fixed bottom-0  p-2 justify-center text-2xl items-center gap-4 bg-white dark:bg-black  border-inherit border-t w-full lg:hidden flex">
      <div className=" flex justify-around items-center w-full ">
        {" "}
        {LoginMenuLinks.map((link) => {
          return (
            <Link
              key={link.id}
              className={` p-2 ${link?.className} text-gray-500 hover:text-black`}
              to={link.stub}
            >
              {link.icon}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TaskBar;
