import React, { forwardRef } from "react";
import { usePostCreator } from "../hooks/usePostCreator";
import { setFocusedIndex } from "../../../redux/slices/uiSlice";

const PostFigure = ({ element, imageInputRef, index }) => {
  const { handleContentEditableChange, handleKeyDown } = usePostCreator();
  return (
    <div
      ref={(el) => (imageInputRef.current[index] = el)}
      key={element.id}
      className="p-4 relative"
    >
      <figure onFocus={() => setFocusedIndex(index)}>
        <img
          className="h-[100%] min-w-full p-2"
          src={element.file}
          alt="Preview"
          id="inputimage"
          contentEditable
          onKeyDown={(e) => handleKeyDown(e, element.id, index)}
        />
        <figcaption>
          <span
            className={`text-center ${element.data === "" && "text-gray-500"}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentEditableChange(element.id, e, index)}
            placeholder={
              element.data === "" ? "Enter description" : element.data
            }
          ></span>
        </figcaption>
      </figure>
    </div>
  );
};

export default PostFigure;
