import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../redux/slices/uiSlice";

function ThemeBtn() {
  // State to track the current theme
  const dispatch = useDispatch();
  const { ThemeMode } = useSelector((state) => state.ui);
  const Modes = useMemo(
    () => [
      {
        name: "Dark mode",
        value: "dark",
        icon: <i className="bi bi-moon-stars-fill"></i>,
      },
      {
        name: "Light mode",
        value: "light",
        icon: <i className="bi bi-sun-fill"></i>,
      },
      // {
      //   name: "System",
      //   value: "system",
      //   icon: <i className="bi bi-circle-half"></i>,
      // },
    ],
    [ThemeMode]
  );

  const changeTheme = () => {
    // Cycle through the themes
    const currentIndex = Modes.findIndex((mode) => mode.value === ThemeMode);
    const { value } = Modes[(currentIndex + 1) % Modes.length];
    document.documentElement.classList.add(value);
    localStorage.setItem("ThemeMode", value);
    dispatch(setThemeMode(value));
  };

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

  // Get the current theme's icon
  const currentMode = Modes.find((mode) => mode.value === ThemeMode);

  return (
    <div className=" relative">
      <button
        onClick={changeTheme}
        aria-label="THEME"
        className="p-2 transition-all duration-100 rounded-full flex items-center"
      >
        {currentMode?.icon}
      </button>
    </div>
  );
}

export default ThemeBtn;
