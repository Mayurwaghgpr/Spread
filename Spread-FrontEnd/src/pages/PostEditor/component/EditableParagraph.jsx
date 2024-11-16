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

  return (
    <div className=" w-full h-full">
      {showToolbar && <TextTools applyStyle={applyStyle} />}
      <p
        ref={(el) => (inputRefs.current[index] = el)}
        contentEditable="true"
        suppressContentEditableWarning
        onInput={(e) => handleTextChange(element.id, e.target.innerHTML)}
        onKeyDown={(e) => {
          if (e.key === "Backspace" || e.key === "Enter" || e.key === "delete")
            handleKeyDown(e, element.id, index);
        }}
        onFocus={handleFocus}
        onMouseUp={handleSelectedText}
        onKeyUp={handleSelectedText}
        className={`border-l border-gray-300 p-2 w-full  min-h-10 z-10 outline-none cursor-text ${(index == 0 && "text-3xl font-semibold") || (index == 1 && "text-xl")}`}
      ></p>
    </div>
  );
};

export default memo(EditableParagraph);
