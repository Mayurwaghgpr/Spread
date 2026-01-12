import {
  IoHomeOutline,
  IoHomeSharp,
  IoLibraryOutline,
  IoLibrarySharp,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";

import { RiQuillPenFill, RiQuillPenLine } from "react-icons/ri";
// import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
function TaskBar() {
  // const { user, isLogin } = useSelector((state) => state.auth);
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
      stub: "/search",
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
    // {
    //   id: uuidv4(),
    //   icon1: <IoIosPeople />,
    //   icon2: <IoIosPeople />,
    //   stub: `/peoples`,
    // },
  ];
  return (
    <div className=" fixed bottom-0 flex justify-center items-center gap-4 w-full border-inherit border-t text-xl py-2 bg-light dark:bg-dark  sm:hidden dark:bg-opacity-50 dark:backdrop-blur-lg bg-opacity-50 backdrop-blur-lg">
      <div className="flex justify-around items-center w-full ">
        {" "}
        {LoginMenuLinks.map((link) => {
          return (
            <NavLink
              key={link.id}
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
