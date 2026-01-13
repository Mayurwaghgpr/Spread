import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsScale } from "../../../store/slices/uiSlice";
import useIcons from "../../../hooks/useIcons";

// Move constants outside component to prevent recreation on each render
const BUTTON_CONFIGS = [
  { type: "text", icon: "alphabetUp", label: "Add text" },
  { type: "url", icon: "link", label: "Add url" },
  { type: "code", icon: "code1", label: "Add code" },
];

const TOOLTIP_CLASS =
  "group-hover:flex hidden justify-center gap-1 text-xs font-light items-center flex-row px-2 rounded-md before:size-2 before:-z-10 before:absolute before:border-b before:border-r before:left-[40%] before:-bottom-1 before:rotate-45 before:bg-inherit text-black dark:bg-white absolute -top-10 border";

const BUTTON_CLASS =
  "group flex justify-center items-center hover:scale-110 shadow-inner hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-md dark:hover:shadow-gray-600";

function InputTypeSelector({
  imageInputRef,
  addElement,
  handleFileChange,
  className,
}) {
  const { isScale } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const icons = useIcons();

  // Memoize handlers to prevent recreating functions on every render
  const toggleScale = useCallback(() => dispatch(setIsScale()), [dispatch]);

  return (
    <div
      className={`transition-all duration-300 ${
        isScale ? "translate-x-0" : "-translate-x-48 sm:translate-x-0"
      } ${className}`}
    >
      {BUTTON_CONFIGS.map(({ type, icon, label }) => (
        <button
          key={type}
          name={type}
          title={type}
          aria-label={label}
          className={BUTTON_CLASS}
          onClick={() => addElement(type)}
        >
          <div className={TOOLTIP_CLASS}>
            <span>add</span>
            {type}
          </div>
          <span>{icons[icon]}</span>
        </button>
      ))}

      <label
        title="add an image"
        aria-label="Add an image"
        className={BUTTON_CLASS}
        htmlFor="imgbtn"
      >
        <span className={`${TOOLTIP_CLASS} w-fit px-2`}>Image</span>
        {icons["image1"]}
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

      <button
        onClick={toggleScale}
        aria-label={isScale ? "Hide toolbar" : "Show toolbar"}
        className="sm:hidden border-none flex justify-center items-center absolute -right-8"
      >
        {!isScale ? icons["doubleArrowR"] : icons["doubleArrowL"]}
      </button>
    </div>
  );
}

export default memo(InputTypeSelector);
