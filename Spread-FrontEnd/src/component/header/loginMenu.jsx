import React, { memo, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../utils/logout";
import userImageSrc from "../../utils/userImageSrc";
import { v4 as uuidv4 } from "uuid";
import { LuLogOut } from "react-icons/lu";
function LoginMenu({ MenuOpen, setIsMenuOpen }) {
  const { user, isLogin } = useSelector((state) => state.auth);
  const Logout = useLogout();
  const location = useLocation();

  const { userImageurl } = userImageSrc(user);

  const emailMasked = useMemo(() => {
    const email = user?.email || "";
    if (email.length < 7) return email;
    return `${email.slice(0, 2)}******${email.slice(6, email.length)}`;
  }, [user]);

  const handleProfileClick = () => {
    setIsMenuOpen(false);
  };
  const LoginMenuLinks = [
    {
      id: uuidv4(),
      lkname: user?.username,
      icon: (
        <img
          className="h-7 w-7 rounded-full object-cover object-top"
          src={userImageurl}
          alt="User profile"
        />
      ),
      stub: `/profile/@${user?.username?.replace(/\s+/g, "")}/${user?.id}`,
    },
    {
      id: uuidv4(),
      lkname: "write",
      icon: <i className="bi bi-pen"></i>,
      stub: "/write",
    },
    {
      id: uuidv4(),
      lkname: "Saved",
      icon: <i className="bi bi-bookmark"></i>,
      stub: "/read",
    },
    {
      id: uuidv4(),
      lkname: "Stories",
      icon: <i className="bi bi-book"></i>,
      stub: "",
    },
    {
      id: uuidv4(),
      lkname: "Settings",
      icon: <i className="bi bi-gear"></i>,
      stub: "/setting",
    },
  ];
  return (
    <div className="fixed z-[100] shadow-lg px-2  right-24 mt-2 rounded-lg dark:bg-[#222222] bg-white  dark:border-[#383838] dark:border">
      <div className="flex min-w-[17rem] flex-col h-full p-4 gap-3 items-start justify-between *:transition-all *:duration-200 dark:*:border-[#383838]">
        {/* Profile Link */}
        {LoginMenuLinks.map((link) => {
          if (link.lkname === "write" && location.pathname != "/write") {
            return (
              <Link
                key={link.id}
                className="flex sm:hidden hover:bg-gray-400 dark:hover:bg-gray-600 px-1 rounded-md  justify-start items-center gap-2 w-full"
                to={link.stub}
                onClick={handleProfileClick}
              >
                {link.icon}
                {link.lkname}
              </Link>
            );
          }
          return (
            <Link
              key={link.id}
              className="flex justify-start hover:bg-gray-100 dark:hover:bg-gray-600 px-1 rounded-md  items-center gap-2 w-full"
              to={link.stub}
              onClick={handleProfileClick}
            >
              {link.icon}
              {link.lkname}
            </Link>
          );
        })}
        {/* Masked email Display */}
        <div className="border-y py-2 border-0   w-full flex items-center gap-2">
          <i className="bi bi-envelope-at"></i> <p>{emailMasked}</p>
        </div>
        {/* Logout Button */}
        <button
          onClick={Logout}
          type="button"
          className="flex gap-2 items-center w-full hover:bg-gray-100 dark:hover:bg-gray-600 px-1 rounded-md"
        >
          <LuLogOut className="text-lg" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default memo(LoginMenu);
