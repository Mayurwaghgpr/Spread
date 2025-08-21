import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

function ThemeBtn({ Modes, className = "", separate = false }) {
  const dispatch = useDispatch();
  const { ThemeMode } = useSelector((state) => state.ui);
  const icons = useIcons();

  // Apply theme changes
  const applyTheme = useCallback((theme) => {
    // Remove all theme classes first
    document.documentElement.classList.remove("dark", "light", "system");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ThemeMode", "dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ThemeMode", "light");
    } else if (theme === "system") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("ThemeMode", "system");
    }
  }, []);

  // Handle theme changes
  useEffect(() => {
    applyTheme(ThemeMode);
  }, [ThemeMode, applyTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (ThemeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [ThemeMode, applyTheme]);

  const changeTheme = () => {
    const currentIndex = Modes.findIndex((mode) => mode.value === ThemeMode);
    const nextTheme = Modes[(currentIndex + 1) % Modes.length];
    dispatch(setThemeMode(nextTheme.value));
  };

  const handleThemeSelect = (themeValue) => {
    dispatch(setThemeMode(themeValue));
  };

  const currentMode = Modes?.find((mode) => mode.value === ThemeMode);

  if (!separate) {
    // Single toggle button
    return (
      <div className={className}>
        <button
          onClick={changeTheme}
          aria-label={`Switch to ${Modes[(Modes.findIndex((mode) => mode.value === ThemeMode) + 1) % Modes.length]?.name}`}
          className=" relative p-3 transition-all duration-200  "
        >
          <div className="text-gray-600 dark:text-gray-400 hover:text-gray-800   transition-transform duration-200">
            {icons[currentMode?.icon || "sun"]}
          </div>
        </button>
      </div>
    );
  }

  // Separate buttons for each theme
  return (
    <div className={`flex gap-1 ${className}`}>
      {Modes.map((mode) => {
        const isActive = mode.value === ThemeMode;

        return (
          <button
            key={mode.value}
            onClick={() => handleThemeSelect(mode.value)}
            aria-label={`Switch to ${mode.name}`}
            aria-pressed={isActive}
            className={`group relative  rounded-lg border transition-all duration-200 hover:scale-105 ${
              isActive
                ? "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 border-inherit shadow-lg shadow-gray-200 dark:shadow-gray-800/50"
                : "bg-light dark:bg-gray-800 text-gray-600 dark:text-gray-400  border-inherit hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            <div
              className={` transition-transform duration-200 ${
                isActive ? "scale-110" : "group-hover:scale-110"
              }`}
            >
              {icons[mode?.icon || "sun"]}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeBtn;
