import useIcons from "../../hooks/useIcons";
import { memo } from "react";

const AIBtn = memo(({ className = "", onClick }) => {
  const icons = useIcons();
  return (
    <button
      type="button"
      title="Spread AI Insights"
      aria-label="Spread AI Insights"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border border-stone-300/80 dark:border-stone-700/80 bg-stone-900/90 text-stone-100 dark:bg-stone-100/95 dark:text-stone-900 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer font-sans text-xs font-semibold ${className}`}
    >
      <span className="text-amber-400 dark:text-amber-600 text-sm flex items-center">
        {icons.appreciate}
      </span>
      <span>Spread AI</span>
      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/15 dark:bg-stone-900/10 font-mono">
        2.5
      </span>
    </button>
  );
});

export default AIBtn;
