import React, { lazy, Suspense, useCallback, useEffect, useMemo } from "react";

import ElementsProvider from "./component/ElementsProvider";

import { usePostCreator } from "./hooks/usePostCreator";
import { useDispatch, useSelector } from "react-redux";
import { setIsScale } from "../../redux/slices/uiSlice";
import { Outlet } from "react-router-dom";

import InputTypeSelector from "./component/InputTypeSelector";
import PostBtn from "../../component/buttons/PostBtn";

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

  const dispatch = useDispatch();
  const { elements, beforsubmit } = useSelector((state) => state.posts);
  const { isScale } = useSelector((state) => state.ui);
  const checkAllMatch = elements.every(
    (obj, i, arr) =>
      (arr.length >= 3 && obj.data !== undefined && obj.data !== "") ||
      (arr.length >= 3 && obj.file && obj.data === "")
  );

  return (
    <>
      <main className="relative flex flex-col justify-between mt-16 mb-32 border-inherit ">
        <PostBtn
          className={`fixed  xl:top-[50%] xl:right-20 top-[85%] z-[50] right-7 text-4xl ${checkAllMatch ? "text-sky-400 animate-bounce" : "text-sky-200 "} rounded-full flex justify-center items-center`}
          content={<i className="bi bi-send-fill"></i>}
          disabled={elements.length > 3 ? false : true}
        />
        <div
          className={`flex  justify-center items-center lg:ms-24  flex-col mt-4 gap-2 `}
        >
          {elements.map((element, index) => (
            <div
              key={element.id}
              className="flex relative justify-start items-center gap-2  xl:w-[60rem]   w-full px-2 "
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
                    <i className="bi bi-x"></i>
                  </span>
                )}
              </div> */}

              <div className="flex w-full  min-h-10 ">
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
          className={`dark:bg-black  text-sm border-inherit sm:rounded-full fixed bg-white sm:bottom-10 bottom-16 rounded-lg  sm:right-36  hover:scale-x-110 gap-3   p-3  bg-opacity-35 backdrop-blur-md border   pointer-events-none flex  justify-center items-end transition-all duration-300 *:transition-all *:duration-200 *:pointer-events-auto ease-in-out font-thin  *:size-[2rem] *:border *:rounded-full *:border-inherit`}
        />
      </main>
      <Outlet context={[imageFiles, setImageFiles, handleTextChange]} />
    </>
  );
}

export default DynamicPostEditor;
