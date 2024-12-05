import React, { memo, useCallback, useState } from "react";
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
    if (document.queryCommandSupported(style)) {
      document.execCommand(style, false, value);
    }
  }, []);

  const handleSelectedText = useCallback(() => {
    const selectedText = window.getSelection
      ? window.getSelection().toString()
      : "";
    setShowToolbar(!!selectedText);
  }, []);

  const handleFocus = useCallback(() => {
    setFocusedIndex(index);
  }, [index, setFocusedIndex]);

  if (index === 0 || index === 1) {
    return (
      <div className="w-full h-full">
        <input
          className={`border-l bg-white dark:bg-inherit border-gray-300 p-2 w-full min-h-10 z-10 outline-none cursor-text ${index === 0 ? "text-4xl" : "text-2xl"}`}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleTextChange(element.id, e.currentTarget.value)}
          placeholder={index === 0 ? "Title" : "Subtitle"}
          onKeyDown={(e) => {
            if (["Backspace", "Enter", "delete"].includes(e.key)) {
              handleKeyDown(e, element.id, index, "input");
            }
          }}
          onFocus={handleFocus}
          onSelect={handleSelectedText}
          type="text"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {showToolbar && <TextTools applyStyle={applyStyle} />}
      <p
        ref={(el) => (inputRefs.current[index] = el)}
        contentEditable="true"
        suppressContentEditableWarning
        onInput={(e) => handleTextChange(element.id, e.currentTarget.innerHTML)}
        onKeyDown={(e) => {
          if (["Backspace", "Enter", "delete"].includes(e.key)) {
            handleKeyDown(e, element.id, index, "p");
          }
        }}
        onFocus={handleFocus}
        onMouseUp={handleSelectedText}
        onKeyUp={handleSelectedText}
        className="border-l border-gray-300 p-2 w-full min-h-10 z-10 outline-none cursor-text"
        role="textbox"
        aria-placeholder="Editable paragraph"
      ></p>
    </div>
  );
};

export default memo(EditableParagraph);
