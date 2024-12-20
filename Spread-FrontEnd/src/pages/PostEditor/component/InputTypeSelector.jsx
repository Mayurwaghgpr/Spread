import React, { memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsScale } from "../../../redux/slices/uiSlice";

function InputTypeSelector({
  imageInputRef,
  addElement,
  handleFileChange,
  className,
}) {
  const { isScale } = useSelector((state) => state.ui);
  const [tooltip, setTooltip] = useState("");
  const dispatch = useDispatch();
  const buttonConsts = useMemo(
    () => [
      { type: "text", icon: "abc" },
      { type: "url", icon: <i className="bi bi-link"></i> },
      { type: "code", icon: <i className="bi bi-braces"></i> },
    ],
    []
  );

  // const getTransitionClass = useMemo(
  //   () =>
  //     `transition-all duration-200 ease-linear ${
  //       isScale ? "scale-100 opacity-100 z-10" : "scale-0 opacity-0 -z-50"
  //     }`,
  //   [isScale]
  return (
    <div
      className={`${isScale ? "translate-x-0" : "-translate-x-56 sm:translate-x-0"} ${className}`}
    >
      {buttonConsts.map((conf, idx) => (
        <button
          key={idx}
          name={conf.type}
          title={conf.type}
          aria-label={`Add ${conf.type}`}
          onMouseOver={() => setTooltip(conf.type)}
          onMouseOut={() => setTooltip("")}
          // className={getTransitionClass}
          className={` flex justify-center items-center  hover:scale-110 shadow-inner hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-md dark:hover:shadow-gray-600`}
          onClick={() => addElement(conf.type)}
        >
          {tooltip === conf.type && (
            <div className=" flex justify-center gap-1 items-center flex-row  px-2 rounded-md  before:size-2 before:absolute before:border-b before:border-r before:left-[40%] before:-bottom-1 before:rotate-45 before:bg-inherit text-black dark:bg-white bg-slate-100 absolute -top-10 border">
              <span>add</span> {conf.type}
            </div>
          )}
          <span>{conf.icon}</span>
        </button>
      ))}
      <label
        title="add an image"
        aria-label="Add an image"
        className={`items-center flex justify-center hover:scale-110  hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-md dark:hover:shadow-gray-600`}
        htmlFor="imgbtn"
        onMouseOver={() => setTooltip("image")}
        onMouseOut={() => setTooltip("")}
      >
        {tooltip === "image" && (
          <span className=" w-fit px-2  rounded-md before:size-2 before:absolute before:left-[40%] before:-bottom-1 before:rotate-45 before:bg-inherit text-black dark:bg-white bg-slate-100 absolute -top-10 border">
            Image
          </span>
        )}
        <i className="bi bi-image-alt"></i>
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
      <span
        onClick={() => dispatch(setIsScale())}
        className=" sm:hidden border-none flex justify-center items-center  absolute -right-8"
      >
        <i className="bi bi-chevron-double-right animate-bounce"></i>
      </span>
    </div>
  );
}

export default memo(InputTypeSelector);
