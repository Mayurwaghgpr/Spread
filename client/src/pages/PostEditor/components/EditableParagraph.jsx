import { memo, useCallback, useRef } from "react";
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
  const containerRef = useRef(null);
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
  }, [setShowToolbar]);

  const handleFocus = useCallback(() => {
    setFocusedIndex(index);
  }, [index, setFocusedIndex]);

  if (index === 0 || index === 1) {
    return (
      <div ref={containerRef} className="w-full relative border-inherit my-1">
        {showToolbar && (
          <TextTools position={showToolbar} applyStyle={applyStyle} />
        )}
        <input
          className={`w-full bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-700 transition-colors ${
            index === 0
              ? "text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight py-2 leading-tight"
              : "text-lg sm:text-xl md:text-2xl font-medium text-stone-600 dark:text-stone-400 py-1 leading-snug"
          }`}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleTextChange(element.id, e.currentTarget.value)}
          onMouseUp={handleSelectedText}
          onKeyUp={handleSelectedText}
          placeholder={index === 0 ? "Title" : "Tell your story..."}
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
    <div ref={containerRef} className="relative w-full border-inherit my-1">
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
        className="w-full bg-transparent border-none outline-none text-stone-800 dark:text-stone-200 text-base sm:text-lg leading-relaxed py-1 min-h-[2.5rem] cursor-text placeholder:text-stone-400 dark:placeholder:text-stone-600"
        role="textbox"
        aria-placeholder="Continue writing..."
      ></p>
    </div>
  );
};

export default memo(EditableParagraph);
