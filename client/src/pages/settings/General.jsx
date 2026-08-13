import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode, setIsScale } from "../../store/slices/uiSlice";
import { Sun, Moon, Laptop, Check, Sliders, Sparkles } from "lucide-react";

function General() {
  const dispatch = useDispatch();
  const { ThemeMode, isScale } = useSelector((state) => state.ui);
  const activeMode = ThemeMode || "system";

  const themeOptions = [
    {
      value: "light",
      name: "Light Mode",
      icon: Sun,
      bg: "bg-stone-100 text-stone-900 border-stone-300",
      previewBg: "bg-white border-stone-200 text-stone-800",
    },
    {
      value: "dark",
      name: "Dark Mode",
      icon: Moon,
      bg: "bg-stone-900 text-stone-100 border-stone-700",
      previewBg: "bg-stone-950 border-stone-800 text-stone-200",
    },
    {
      value: "system",
      name: "System Default",
      icon: Laptop,
      bg: "bg-stone-800 text-stone-100 border-stone-600",
      previewBg: "bg-gradient-to-r from-stone-100 to-stone-900 text-stone-500",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>Appearance & Theme</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Customize the visual theme and layout density of your Spread workspace.
        </p>
      </div>

      {/* Theme Selection Visual Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
          Theme Preference
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = activeMode === opt.value;

            return (
              <div
                key={opt.value}
                onClick={() => dispatch(setThemeMode(opt.value))}
                className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isActive
                    ? "border-stone-900 dark:border-stone-100 bg-stone-200/50 dark:bg-stone-800/50 shadow-md scale-[1.02]"
                    : "border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-800/20 hover:border-stone-400 dark:hover:border-stone-600"
                }`}
              >
                {/* Visual Preview Badge */}
                <div
                  className={`w-full h-16 rounded-xl border p-2 flex flex-col justify-between shadow-inner ${opt.previewBg}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="h-2 w-2/3 bg-current opacity-20 rounded-full" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-stone-800 dark:text-stone-200" />
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {opt.name}
                    </span>
                  </div>

                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interface Density & Scaling */}
      <div className="pt-2">
        <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Compact Layout Scale
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Adjust interface spacing and component density across pages.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isScale}
            onClick={() => dispatch(setIsScale())}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
              isScale ? "bg-stone-900 dark:bg-stone-100" : "bg-stone-300 dark:bg-stone-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow-md ring-0 transition duration-200 ease-in-out ${
                isScale ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(General);
