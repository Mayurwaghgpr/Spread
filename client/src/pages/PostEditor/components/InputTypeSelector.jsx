import { memo, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsScale } from "../../../store/slices/uiSlice";
import useIcons from "../../../hooks/useIcons";

function InputTypeSelector({
  imageInputRef,
  addElement,
  handleFileChange,
  className = "",
}) {
  const { isScale } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const icons = useIcons();

  const toggleScale = useCallback(() => dispatch(setIsScale()), [dispatch]);

  const buttonConfigs = useMemo(
    () => [
      { type: "text", icon: icons.type, label: "Add paragraph text" },
      { type: "url", icon: icons.link, label: "Add URL link" },
      { type: "code", icon: icons.code, label: "Add code block" },
    ],
    [icons]
  );

  return (
    <div
      className={`fixed sm:bottom-8 bottom-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 spread-card rounded-full border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-xl bg-stone-100/90 dark:bg-stone-900/90 transition-all duration-300 ${
        isScale ? "translate-y-0 opacity-100" : "sm:translate-y-0 sm:opacity-100 translate-y-20 opacity-0"
      } ${className}`}
    >
      {buttonConfigs.map(({ type, icon, label }) => (
        <button
          key={type}
          type="button"
          name={type}
          title={label}
          aria-label={label}
          onClick={() => addElement(type)}
          className="group relative p-2.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-all active:scale-95 cursor-pointer"
        >
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-2.5 py-1 text-[11px] font-semibold bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in duration-150">
            {label}
          </span>
          <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
        </button>
      ))}

      {/* Image Upload Button */}
      <label
        title="Add an image"
        aria-label="Add an image"
        htmlFor="imgbtn"
        className="group relative p-2.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-all active:scale-95 cursor-pointer"
      >
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-2.5 py-1 text-[11px] font-semibold bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in duration-150">
          Upload Image
        </span>
        <span className="w-4 h-4 flex items-center justify-center">{icons.image}</span>
      </label>

      <input
        ref={imageInputRef}
        className="hidden"
        id="imgbtn"
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={toggleScale}
        aria-label={isScale ? "Hide toolbar" : "Show toolbar"}
        className="sm:hidden p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
      >
        {!isScale ? (
          <span className="w-4 h-4 flex items-center justify-center">{icons.chevronRight}</span>
        ) : (
          <span className="w-4 h-4 flex items-center justify-center">{icons.chevronLeft}</span>
        )}
      </button>
    </div>
  );
}

export default memo(InputTypeSelector);

