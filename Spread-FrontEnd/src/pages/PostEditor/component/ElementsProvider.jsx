import React, { lazy } from "react";
import EditableParagraph from "./EditableParagraph";
const CodeEditor = lazy(
  () => import("../../../component/WriterTools/codeEditor")
);

const ElementsProvider = ({
  element,
  index,
  handleKeyDown,
  handleTextChange,
  handleContentEditableChange,
  inputRefs,
  focusedIndex,
  setFocusedIndex,
}) => {
  // console.log("wriet");
  switch (element.type) {
    case "text":
    case "url":
      return (
        <EditableParagraph
          inputRefs={inputRefs}
          element={element}
          index={index}
          handleTextChange={handleTextChange}
          handleKeyDown={handleKeyDown}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
        />
      );

    case "code":
      return (
        <CodeEditor
          inputRefs={inputRefs}
          element={element}
          index={index}
          handleTextChange={handleTextChange}
          handleKeyDown={handleKeyDown}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
        />
      );

    case "image":
      return (
        <figure
          key={element.id}
          ref={(el) => (inputRefs.current[index] = el)}
          onFocus={() => setFocusedIndex(index)}
          className="p-4 w-full"
          onKeyDown={(e) => handleKeyDown(e, element.id, index)}
        >
          <button
            onClick={(e) => handleKeyDown(e, element.id, index)}
            className=" bg-gray-200 bg-opacity-20 hover:bg-opacity-100 absolute top-2 rounded-full right-4 text-lg size-5 sm:hidden flex justify-center items-center "
          >
            <i className="bi bi-x"></i>{" "}
          </button>
          <img
            className="h-[100%] min-w-full p-2"
            src={element.file}
            alt="Preview"
            id="inputimage"
            contentEditable
          />
          <figcaption>
            <span
              className={`text-center ${
                element.data === "" && "text-gray-500"
              }`}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableChange(element.id, e, index)}
              placeholder={
                element.data === "" ? "Enter description" : element.data
              }
            ></span>
          </figcaption>
        </figure>
      );

    default:
      return <input type="text" />;
  }
};

export default ElementsProvider;
