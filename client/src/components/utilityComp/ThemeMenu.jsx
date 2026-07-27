import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setThemeMode } from "../../store/slices/uiSlice";

function ThemeMenu({ className }) {
  const [showThemeList, setShowThemeList] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { ThemeMode } = useSelector((state) => state.ui);

  const handeltheme = (mode) => {
    dispatch(setThemeMode(mode));
  };

  const Modes = [
    {
      name: "Dark mode",
      value: "dark",
      icon: <i class="bi bi-moon-stars-fill"></i>,
    },
    {
      name: "Light mode",
      value: "light",
      icon: <i class="bi bi-sun-fill"></i>,
    },
    {
      name: "System",
      value: "system",
      icon: <i class="bi bi-circle-half"></i>,
    },
  ];
  const selectedTheme = useMemo(
    () => Modes.find((mode) => mode?.value === ThemeMode),
    [ThemeMode]
  );

  return (
    <div className="relative flex flex-col ">
      <button
        onClick={() => {
          setShowThemeList((prev) => !prev);
        }}
        className=" p-1 relative capitalize text-center flex items-center justify-center gap-4 rounded-md"
      >
        {selectedTheme?.icon}
        <span className="sm:block hidden">{selectedTheme?.value}</span>
        {
          <i
            className={`bi bi-caret-up  ${!showThemeList ? "rotate-180 " : ""}`}
          ></i>
        }
      </button>
      {showThemeList && (
        <ul className={className}>
          {Modes.map((mode) => (
            <li
              className={`flex justify-start items-center cursor-pointer gap-1  p-2 rounded-lg ${
                ThemeMode === mode.value ? "bg-gray-500 bg-opacity-10" : ""
              }`}
              onClick={() => handeltheme(mode.value)}
              key={mode.value}
            >
              <span>{mode?.icon}</span>
              <span className="sm:block hidden"> {mode.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ThemeMenu;
