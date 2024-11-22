import React, { lazy, Suspense, useCallback, useEffect, useMemo } from "react";

import WriteElements from "./component/WriteElements";

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
  const checkAllMatch = () => {
    return elements.every(
      (obj, i, arr) =>
        arr.length > 3 && obj.name !== undefined && obj.name !== ""
    );
  };

  console.log(elements);
  return (
    <>
      <main className="flex flex-col justify-between mt-16 ">
        <PostBtn
          className={`fixed  sm:top-[13%] sm:right-32 top-[80%] right-10 text-4xl ${checkAllMatch() ? "text-sky-400 animate-bounce" : "text-sky-200 "} rounded-full flex justify-center items-center`}
          content={<i className="bi bi-send"></i>}
          disabled={checkAllMatch()}
        />
        <div
          className={`flex  justify-center items-center lg:ms-24  flex-col mt-4 gap-2`}
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

              <div className="flex w-full  min-h-10">
                <WriteElements
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
          className={`flex gap-5 border p-3 rounded-full absolute pointer-events-none left-1 sm:left-[40%] bottom-20 justify-center items-end transition-all duration-300 *:transition-all *:duration-200 *:pointer-events-auto ease-in-out font-thin *:size-[2.5rem] *:border *:rounded-full *:border-black text-gray-600 `}
        />
      </main>
      <Outlet context={[imageFiles, setImageFiles, handleTextChange]} />
    </>
  );
}

export default DynamicPostEditor;
