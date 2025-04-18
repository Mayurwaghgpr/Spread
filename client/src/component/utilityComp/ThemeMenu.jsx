import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../redux/slices/uiSlice";
import { useLocation } from "react-router-dom";

function ThemeMenu({ className }) {
  const [showThemeList, setShowThemeList] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { ThemeMode } = useSelector((state) => state.ui);

  const handeltheme = (mode) => {
    document.documentElement.classList.add(mode);
    localStorage.setItem("ThemeMode", mode);
    dispatch(setThemeMode(mode));
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [dispatch]);

  // Handle dark mode based on ThemeMode
  useMemo(() => {
    if (ThemeMode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ThemeMode", "dark");
    } else if (ThemeMode === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ThemeMode", "light");
    } else if (ThemeMode === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [ThemeMode]);

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
