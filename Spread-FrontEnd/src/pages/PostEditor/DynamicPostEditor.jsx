import React, { lazy, Suspense, useCallback, useEffect, useMemo } from "react";

import WriteElements from "./component/WriteElements";

import { usePostCreator } from "./hooks/usePostCreator";
import { useDispatch, useSelector } from "react-redux";
import { setIsScale } from "../../redux/slices/uiSlice";
import { Outlet } from "react-router-dom";

import InputTypeSelector from "./component/InputTypeSelector";

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

  return (
    <main className="flex flex-col justify-between mt-16 ">
      <div className={`flex  justify-center items-center  flex-col mt-4 gap-2`}>
        {elements.map((element, index) => (
          <div
            key={element.id}
            className="flex relative justify-start items-center gap-2  xl:w-[60rem]   w-full px-2 "
          >
            <div
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
            </div>

            {focusedIndex === index && element.data === "" && (
              <InputTypeSelector
                imageInputRef={imageInputRef}
                addElement={addElement}
                handleFileChange={handleFileChange}
              />
            )}
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
        <Outlet context={[imageFiles, setImageFiles, handleTextChange]} />
      </div>
    </main>
  );
}

export default DynamicPostEditor;
