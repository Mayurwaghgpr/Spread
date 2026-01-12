import ElementsProvider from "./components/ElementsProvider";
import { usePostCreator } from "./hooks/usePostCreator";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import InputTypeSelector from "./components/InputTypeSelector";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../../components/buttons/Ibutton";

function DynamicPostEditor() {
  const {
    addElement,
    handleFileChange,
    handleTextChange,
    handleContentEditableChange,
    imageInputRef,
    inputRefs,
    imageFiles,
    setImageFiles,
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  } = usePostCreator();

  const { elements } = useSelector((state) => state.posts);
  const icons = useIcons();
  const navigate = useNavigate();

  const checkAllMatch = elements.every(
    (obj, i, arr) =>
      (arr.length > 3 && obj.data !== undefined && obj.data !== "") ||
      (arr.length > 3 && obj.file && obj.data === "")
  );

  return (
    <>
      <section className="relative flex flex-col justify-between w-full border-inherit  ">
        <Ibutton
          action={() => navigate("/write/publish")}
          className={`fixed  xl:top-[50%] xl:right-20 top-[85%] z-[50] right-7 text-sm flex justify-center items-center border rounded-full px-2  p-1 ${checkAllMatch ? "text-gray-600" : "text-gray-400 "} rounded-full flex justify-center items-center`}
          disabled={elements.length > 3 ? false : true}
        >
          continue {icons["sendO"]}
        </Ibutton>
        <div
          className={`flex flex-col justify-center items-center border-inherit mx-auto gap-2 pt-5 pb-32`}
        >
          {elements.map((element, index) => (
            <div
              key={element.id}
              className="flex relative justify-start items-center gap-2 xl:w-[50rem] w-full px-2 border-inherit "
            >
              <div className="flex w-full min-h-10 border-inherit">
                <ElementsProvider
                  element={element}
                  handleTextChange={handleTextChange}
                  index={index}
                  handleKeyDown={handleKeyDown}
                  handleContentEditableChange={handleContentEditableChange}
                  inputRefs={inputRefs}
                  imageInputRef={imageInputRef}
                  focusedIndex={focusedIndex}
                  setFocusedIndex={setFocusedIndex}
                />
              </div>
            </div>
          ))}
        </div>
        <InputTypeSelector
          imageInputRef={imageInputRef}
          addElement={addElement}
          handleFileChange={handleFileChange}
          className={`fixed sm:bottom-10 bottom-16 sm:right-1/2 flex justify-between items-end gap-3 p-3  bg-light dark:bg-dark border border-inherit sm:rounded-full rounded-lg transition-all duration-300 hover:scale-x-110 bg-opacity-35 backdrop-blur-md   pointer-events-none  *:transition-all *:duration-200 *:pointer-events-auto ease-in-out  *:size-[2rem] *:border *:rounded-full *:border-inherit`}
        />
      </section>
      <Outlet context={[imageFiles, setImageFiles, handleTextChange]} />
    </>
  );
}

export default DynamicPostEditor;
