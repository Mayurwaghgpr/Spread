import React from "react";

import ElementsProvider from "./component/ElementsProvider";

import { usePostCreator } from "./hooks/usePostCreator";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import InputTypeSelector from "./component/InputTypeSelector";
import PostBtn from "../../component/buttons/PostBtn";
import useIcons from "../../hooks/useIcons";

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
  const checkAllMatch = elements.every(
    (obj, i, arr) =>
      (arr.length > 3 && obj.data !== undefined && obj.data !== "") ||
      (arr.length > 3 && obj.file && obj.data === "")
  );

  return (
    <>
      <section className="relative flex flex-col justify-between w-full border-inherit  ">
        <PostBtn
          className={`fixed  xl:top-[50%] xl:right-20 top-[85%] z-[50] right-7 text-4xl ${checkAllMatch ? "text-sky-400 animate-bounce" : "text-sky-200 "} rounded-full flex justify-center items-center`}
          disabled={elements.length > 3 ? false : true}
        />
        <div
          className={`flex flex-col justify-center items-center border-inherit mx-auto gap-2 pt-5 pb-32`}
        >
          {elements.map((element, index) => (
            <div
              key={element.id}
              className="flex relative justify-start items-center gap-2 xl:w-[50rem] w-full px-2 border-inherit "
            >
              {/* <div
                className={`flex w-[2.5rem] justify-between  items-center  transition-transform duration-100 sm:overflow-hidden`}
              >
                {focusedIndex === index && element.data === "" && (
                  <span
                    onClick={() => dispatch(setIsScale())}
                    title="more inputs"
                    className={`w-full z-10 rounded-full border text-3xl font-extralight flex justify-center items-center cursor-pointer transition-transform duration-100 ${
                      isScale ? "rotate-0" : " rotate-45"
                    }`}
                  >
                    {icons["close"]}
                  </span>
                )}
              </div> */}

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
