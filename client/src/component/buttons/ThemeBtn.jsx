import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

function ThemeBtn({ Modes, className = "", separate = false }) {
  const dispatch = useDispatch();
  const { ThemeMode } = useSelector((state) => state.ui);
  const icons = useIcons();
  useEffect(() => {
    const savedTheme = localStorage.getItem("ThemeMode") || "system";
    dispatch(setThemeMode(savedTheme));
  }, [dispatch]);

  // Apply theme changes
  const applyTheme = useCallback((theme) => {
    document.documentElement.classList.remove("dark", "light");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (theme === "system") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isDarkMode) document.documentElement.classList.add("dark");
    }

    localStorage.setItem("ThemeMode", theme);
  }, []);

  // Handle theme changes
  // useEffect(() => {
  //   applyTheme(ThemeMode);
  // }, [ThemeMode, applyTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (ThemeMode !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [ThemeMode, applyTheme]);

  // Cycle through available modes
  const changeTheme = useCallback(() => {
    const currentIndex = Modes.findIndex((m) => m.value === ThemeMode);
    const nextTheme = Modes[(currentIndex + 1) % Modes.length].value;
    dispatch(setThemeMode(nextTheme));
  }, [ThemeMode, Modes, dispatch]);

  // Manual theme select
  const handleThemeSelect = useCallback(
    (themeValue) => dispatch(setThemeMode(themeValue)),
    [dispatch]
  );

  const currentMode = Modes?.find((mode) => mode.value === ThemeMode);

  if (!separate) {
    // Single toggle button
    return (
      <button
        onClick={changeTheme}
        aria-label={`Switch to ${Modes[(Modes.findIndex((mode) => mode.value === ThemeMode) + 1) % Modes.length]?.name}`}
        className={`relative transition-all duration-200  ${className}`}
      >
        <div className="  transition-transform duration-200">
          {icons?.[currentMode?.icon] ?? icons?.sun}
        </div>
      </button>
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
              {icons?.[currentMode?.icon] ?? icons?.sun}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeBtn;
