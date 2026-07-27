import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

function ThemeBtn({ Modes, className = "", separate = false }) {
  const dispatch = useDispatch();
  const { ThemeMode } = useSelector((state) => state.ui);
  const icons = useIcons();

  const activeMode = ThemeMode || "system";

  // Cycle through available modes
  const changeTheme = useCallback(() => {
    if (!Modes || Modes.length === 0) return;
    const currentIndex = Modes.findIndex((m) => m.value === activeMode);
    const nextIndex = (currentIndex + 1) % Modes.length;
    dispatch(setThemeMode(Modes[nextIndex].value));
  }, [activeMode, Modes, dispatch]);

  // Manual theme select
  const handleThemeSelect = useCallback(
    (themeValue) => dispatch(setThemeMode(themeValue)),
    [dispatch],
  );

  const currentMode = Modes?.find((mode) => mode.value === activeMode);

  if (!separate) {
    // Single toggle button
    return (
      <button
        onClick={changeTheme}
        aria-label={`Switch to ${Modes?.[(Modes.findIndex((mode) => mode.value === activeMode) + 1) % Modes.length]?.name || "next mode"}`}
        className={`relative transition-all duration-200 focus-ring rounded-lg p-1.5 ${className}`}
      >
        <div className="transition-transform duration-200 hover:scale-110">
          {icons?.[currentMode?.icon] ?? icons?.sun}
        </div>
      </button>
    );
  }

  // Separate buttons for each theme
  return (
    <div className={`flex gap-1.5 ${className}`}>
      {Modes?.map((mode) => {
        const isActive = mode.value === activeMode;

        return (
          <button
            key={mode.value}
            onClick={() => handleThemeSelect(mode.value)}
            aria-label={`Switch to ${mode.name}`}
            aria-pressed={isActive}
            className={`group relative rounded-xl p-2 border transition-all duration-200 focus-ring ${
              isActive
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm"
                : "bg-laccent dark:bg-daccent text-gray-600 dark:text-gray-400 border-[#d8cebe] dark:border-[#2a2a2a] hover:bg-gray-200/60 dark:hover:bg-gray-800/60"
            }`}
          >
            <div
              className={`transition-transform duration-200 ${
                isActive ? "scale-110" : "group-hover:scale-110"
              }`}
            >
              {icons?.[mode?.icon] ?? icons?.sun}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeBtn;
