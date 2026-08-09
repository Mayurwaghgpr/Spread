import useIcons from "../../hooks/useIcons";
import { memo } from "react";

const AIBtn = memo(({ className, onClick }) => {
  const icons = useIcons();
  return (
    <button
      type="button"
      title="AI Analysis"
      aria-label="AI Analysis"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      className={`border border-inherit bg-light dark:bg-dark text-stone-900 dark:text-stone-100 hover:bg-[#f5f1ec] dark:hover:bg-[#121212] sm:text-base text-sm flex items-center justify-center gap-1.5 cursor-pointer font-semibold shadow-md transition-all duration-200 rounded-full px-4 py-2 ${className}`}
    >
      <span>AI</span>
      {icons["glitter"]}
    </button>
  );
});

export default AIBtn;
