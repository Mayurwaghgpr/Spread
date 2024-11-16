import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";

function InputTypeSelector({ imageInputRef, addElement, handleFileChange }) {
  const { isScale } = useSelector((state) => state.ui);

  const buttonConsts = useMemo(
    () => [
      { type: "text", icon: "abc" },
      { type: "url", icon: <i className="bi bi-link"></i> },
      { type: "code", icon: <i className="bi bi-braces"></i> },
    ],
    []
  );

  const getTransitionClass = useMemo(
    () =>
      `transition-all duration-200 ease-linear ${
        isScale ? "scale-100 opacity-100 z-10" : "scale-0 opacity-0 -z-50"
      }`,
    [isScale]
  );
  return (
    <div
      className={`flex gap-2 absolute pointer-events-none  left-10 justify-center px-5 items-end transition-all duration-500 *:pointer-events-auto ease-in-out font-thin *:h-[2.5rem] *:w-[2.5rem] *:border *:rounded-full *:border-slate-500 text-slate-600 `}
    >
      {buttonConsts.map((conf, idx) => (
        <button
          key={idx}
          name={conf.type}
          title={conf.type}
          aria-label={`Add ${conf.type}`}
          className={getTransitionClass}
          onClick={() => addElement(conf.type)}
        >
          {conf.icon}
        </button>
      ))}
      <label
        title="add an image"
        aria-label="Add an image"
        className={`items-center flex justify-center ${getTransitionClass}`}
        htmlFor="imgbtn"
      >
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
    </div>
  );
}

export default memo(InputTypeSelector);
