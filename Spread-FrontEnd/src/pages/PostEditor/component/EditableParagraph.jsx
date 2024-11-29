import React, { memo, useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextTools from "./TextTools";
const EditableParagraph = ({
  element,
  index,
  handleKeyDown,
  inputRefs,
  handleTextChange,
  focusedIndex,
  setFocusedIndex,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);

  const applyStyle = useCallback((style, value = null) => {
    document.execCommand(style, false, value);
  }, []);

  const handleSelectedText = useCallback(() => {
    const selectedText = window.getSelection().toString();
    setShowToolbar(!!selectedText);
  }, []);

  const handleFocus = useCallback(() => {
    setFocusedIndex(index);
  }, [index]);
  if (index === 0 || index === 1) {
    return (
      <div className=" w-full h-full">
        <input
          className={`border-l bg-white dark:bg-inherit border-gray-300 p-2 w-full  min-h-10 z-10 outline-none cursor-text  ${index === 0 ? "text-4xl" : index === 1 && "text-2xl"}`}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleTextChange(element.id, e.currentTarget.value)}
          placeholder={index == 0 ? "Title" : index == 1 && "SubTitle"}
          onKeyDown={(e) => {
            if (
              e.key === "Backspace" ||
              e.key === "Enter" ||
              e.key === "delete"
            )
              handleKeyDown(e, element.id, index);
          }}
          onFocus={handleFocus}
          onSelect={handleSelectedText}
          // onKeyUp={handleSelectedText}
          type="text"
          name=""
          id=""
        />
      </div>
    );
  }

  return (
    <div className=" w-full h-full">
      {showToolbar && <TextTools applyStyle={applyStyle} />}
      <p
        ref={(el) => (inputRefs.current[index] = el)}
        contentEditable="true"
        suppressContentEditableWarning
        onInput={(e) => handleTextChange(element.id, e.currentTarget.innerHTML)}
        onKeyDown={(e) => {
          if (e.key === "Backspace" || e.key === "Enter" || e.key === "delete")
            handleKeyDown(e, element.id, index);
        }}
        onFocus={handleFocus}
        onMouseUp={handleSelectedText}
        onKeyUp={handleSelectedText}
        aria-placeholder="Title"
        className={`border-l border-gray-300 p-2 w-full  min-h-10 z-10 outline-none cursor-text`}
      ></p>
    </div>
  );
};

export default memo(EditableParagraph);
