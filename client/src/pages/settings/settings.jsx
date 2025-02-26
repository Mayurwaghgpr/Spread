import React, { memo } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { LuGithub } from "react-icons/lu";

function Settings() {
  const navigate = useNavigate();

  const settingItem = [
    { name: "General", icon: <i className="bi bi-gear"></i> || "G", stub: "" },
    { name: "Sync Github", icon: <LuGithub />, stub: "githubSynch" },
  ];

  return (
    <div
      onClick={(e) => {
        navigate(-1);
      }}
      className="fixed  top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[100] bg-black border-inherit bg-opacity-30 sm:px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" relative sm:w-[70%] sm:h-[40rem] h-full w-full flex flex-col  overflow-hidden items-center border bg-[#f3efeb] dark:bg-[#222222] border-inherit sm:rounded-lg"
      >
        <header className="w-full text-4xl flex justify-between items-center p-5 border-b border-inherit">
          <h1> Settings</h1>
          <button
            onClick={(e) => {
              navigate(-1);
            }}
            className="sm:hidden block"
          >
            <i className="bi bi-x-lg"></i>
          </button>
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
