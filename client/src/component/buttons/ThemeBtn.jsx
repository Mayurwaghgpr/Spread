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
          className="group relative p-3 bg-[#fff9f3] dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg dark:hover:shadow-xl"
        >
          <div className="text-gray-600 dark:text-gray-400 text-lg group-hover:scale-110 transition-transform duration-200">
            {icons[currentMode?.icon || "sun"]}
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {currentMode?.name || "Toggle Theme"}
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
            className={`group relative px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
              isActive
                ? "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-700 dark:border-gray-300 shadow-lg shadow-gray-200 dark:shadow-gray-800/50"
                : "bg-[#fff9f3] dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            <div
              className={`text-sm transition-transform duration-200 ${
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
