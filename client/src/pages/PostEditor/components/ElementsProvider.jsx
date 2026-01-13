import { lazy } from "react";
import EditableParagraph from "./EditableParagraph";
import Ibutton from "../../../components/buttons/Ibutton";
import useIcons from "../../../hooks/useIcons";
const CodeEditor = lazy(() => import("./codeEditor"));
const ImageFigure = lazy(
  () => import("../../../components/utilityComp/ImageFigure")
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
  const icons = useIcons();
  const inputObj = {
    text: (
      <EditableParagraph
        inputRefs={inputRefs}
        element={element}
        index={index}
        handleTextChange={handleTextChange}
        handleKeyDown={handleKeyDown}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
      />
    ),
    code: (
      <CodeEditor
        inputRefs={inputRefs}
        element={element}
        index={index}
        handleTextChange={handleTextChange}
        handleKeyDown={handleKeyDown}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
      />
    ),
    image: (
      <div
        key={element.id}
        ref={(el) => (inputRefs.current[index] = el)}
        onFocus={() => setFocusedIndex(index)}
        className="p-4 w-full"
        onKeyDown={(e) => handleKeyDown(e, element.id, index)}
      >
        <Ibutton
          className="absolute top-2 right-4  flex justify-center items-center bg-gray-200 bg-opacity-20 hover:bg-opacity-100  rounded-full text-lg size-5 sm:hidden  "
          action={(e) => handleKeyDown(e, element.id, index)}
          innerText={icons["close"]}
        />
        <ImageFigure
          className="h-[100%] min-w-full "
          imageUrl={element.file}
          altText={"Preview"}
          id="inputimage"
          contentEditable
          loading="lazy"
          caption={
            <span
              className={`text-center ${element.data === "" && "text-gray-500"}`}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableChange(element.id, e, index)}
              placeholder={
                element.data === "" ? "Enter description" : element.data
              }
            ></span>
          }
        />
      </div>
    ),
  };
  return inputObj[element.type] || inputObj["text"];
};

export default ElementsProvider;
