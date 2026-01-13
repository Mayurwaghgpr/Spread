import { memo } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function Settings() {
  const navigate = useNavigate();
  const icons = useIcons();
  const settingItem = [
    { name: "General", icon: icons["gearO"] || "G", stub: "" },
    // { name: "Sync Github", icon: icons["github"], stub: "githubSynch" },
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
        className=" relative sm:w-[50%] sm:h-[40rem] h-full w-full flex  overflow-hidden items-center border bg-light dark:bg-dark border-inherit sm:rounded-lg"
      >
        <aside className=" h-full  p-6  min-w-[30%] flex flex-col gap-10 border-e dark:bg-daccent bg-laccent border-inherit ">
          <ul className=" flex flex-col gap-4 p">
            {settingItem.map((setting) => (
              <Link
                to={setting.stub}
                className="flex justify-start items-center gap-1 cursor-pointer p-2 rounded-xl transition-all duration-300 hover:bg-[#e6e6e6] dark:hover:bg-[#3c3c3c]"
                replace={true}
              >
                <span>{setting.icon}</span>
                {setting.name}
              </Link>
            ))}
          </ul>
        </aside>

        <div className="h-full  flex flex-col justify-between text-sm w-full border-inherit">
          <header className="w-full text-2xl h-fit flex justify-between items-center p-3 border-b border-inherit">
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
          <div className=" w-full border-inherit p-3 h-full">{<Outlet />}</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Settings);
