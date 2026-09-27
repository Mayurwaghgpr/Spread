import { useEffect } from "react";

export const PopupBox = ({ children, className = "", action }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        action?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [action]);

  return (
    <div
      onClick={action}
      className="fixed inset-0 p-3 sm:p-6 flex justify-center items-center bg-black/50 backdrop-blur-xs z-50 transition-all duration-200 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${className} bg-[#fffdfa] dark:bg-[#121215] border border-[#e5dfd5] dark:border-[#232328] rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-150`}
      >
        {children}
      </div>
    </div>
  );
};

export default PopupBox;
