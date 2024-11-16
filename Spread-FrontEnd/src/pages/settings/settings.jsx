import React, { memo, useEffect, useRef } from "react";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Theme from "./Theme";
import { LuGithub } from "react-icons/lu";

function Settings() {
  const navigate = useNavigate();

  const settingItem = [
    { name: "General", icon: <i className="bi bi-gear"></i>, stub: "" },
    { name: "Sync Github", icon: <LuGithub />, stub: "githubSynch" },
  ];

  return (
    <div
      onClick={(e) => {
        navigate(-1);
      }}
      className="fixed  top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[100] bg-black border-inherit bg-opacity-30 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" relative sm:w-[70%] h-[600px] flex flex-col  overflow-hidden items-center border bg-white dark:bg-[#222222] border-inherit rounded-lg"
      >
        <header className="w-full text-4xl p-5 border-b border-inherit">
          <h1> Settings</h1>
        </header>
        <div className="h-full py-3 flex justify-between text-sm w-full border-inherit">
          <aside className=" h-full  px-6  min-w-fit flex flex-col gap-10 ">
            <ul className=" flex flex-col gap-4">
              {settingItem.map((setting) => (
                <Link
                  to={setting.stub}
                  className="flex justify-start items-center gap-1 cursor-pointer"
                  replace={true}
                >
                  <span>{setting.icon}</span>
                  {setting.name}
                </Link>
              ))}
            </ul>
          </aside>
          <div className=" w-full border-inherit">{<Outlet />}</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Settings);
