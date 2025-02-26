import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../redux/slices/uiSlice";

function ThemeBtn({ Modes, className, separate }) {
  // State to track the current theme
  const dispatch = useDispatch();
  const { ThemeMode } = useSelector((state) => state.ui);

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
  const currentMode = Modes?.find((mode) => mode.value === ThemeMode);

  return (
    <div className={className}>
      {/* It used when theme buttons to be displayed separetly */}
      {!separate ? (
        <button
          onClick={changeTheme}
          aria-label="THEME"
          className="p-2 transition-all duration-100 rounded-full flex items-center"
        >
          {currentMode?.icon}
        </button>
      ) : (
        //It used to diplay toggle buttons
        Modes.map((mode) => {
          return (
            <button
              key={mode.value}
              onClick={() => {
                dispatch(setThemeMode(mode.value));
              }}
              aria-label="THEME"
              className={`${mode.value === ThemeMode ? "shadow-md dark:shadow-[#c5c3c3] scale-110" : " shadow-none"} transition-all duration-100  flex items-center`}
            >
              {mode?.icon}
            </button>
          );
        })
      )}
    </div>
  );
}

export default ThemeBtn;
