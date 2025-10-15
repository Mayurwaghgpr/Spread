import React, { memo, useCallback, useRef } from "react";
import TextTools from "./TextTools";
import useClickOutside from "../../../hooks/useClickOutside";

const EditableParagraph = ({
  element,
  index,
  handleKeyDown,
  inputRefs,
  handleTextChange,
  focusedIndex,
  setFocusedIndex,
}) => {
  const containerRef = useRef(null); // Ensure it's used properly
  const { menuId: showToolbar, setMenuId: setShowToolbar } =
    useClickOutside(containerRef);
  const applyStyle = useCallback((style, value = null) => {
    if (document.queryCommandSupported(style)) {
      document.execCommand(style, false, value);
    }
  }, []);

  const handleSelectedText = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowToolbar(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width === 0) {
      setShowToolbar(null);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const x = Math.floor(rect.left + rect.width / 2 - containerRect.left) + 7;
    const y = rect.top - containerRect.top;

    setShowToolbar({ x, y });
  }, [index, inputRefs]);

  const handleFocus = useCallback(() => {
    setFocusedIndex(index);
  }, [index, setFocusedIndex]);

  if (index === 0 || index === 1) {
    return (
      <div ref={containerRef} className="w-full h-full relative border-inherit">
        {showToolbar && (
          <TextTools position={showToolbar} applyStyle={applyStyle} />
        )}
        <input
          className={`border-l-2 rounded-lg border-inherit bg-inherit dark:bg-inherit border-gray-300 dark:border-white p-2 w-full min-h-10 z-10 dark:placeholder:text-white placeholder:text-black placeholder:opacity-50 outline-none cursor-text ${index === 0 ? "text-4xl font-semibold " : "text-2xl"}`}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleTextChange(element.id, e.currentTarget.value)}
          onMouseUp={handleSelectedText}
          onKeyUp={handleSelectedText}
          placeholder={index === 0 ? "Title" : "Subtitle"}
          onKeyDown={(e) => {
            if (["Backspace", "Enter", "delete"].includes(e.key)) {
              handleKeyDown(e, element.id, index, "input");
            }
          }}
          onFocus={handleFocus}
          onSelect={handleSelectedText}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full border-inherit">
      {showToolbar && (
        <TextTools position={showToolbar} applyStyle={applyStyle} />
      )}
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
        className="border-l-2 border-inherit border-gray-300 dark:border-white rounded-lg p-2 w-full min-h-10 z-10 outline-none cursor-text"
        role="textbox"
        aria-placeholder="Editable paragraph"
      ></p>
    </div>
  );
};

export default memo(EditableParagraph);
