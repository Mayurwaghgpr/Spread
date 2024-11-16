import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setElements } from "../../../redux/slices/postSlice";
import { debounce } from "../../../utils/debounce";
import { setIsScale } from "../../../redux/slices/uiSlice";

export const usePostCreator = () => {
  const { elements } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [focusedIndex, setFocusedIndex] = useState(elements.length);
  const [imageFiles, setImageFiles] = useState([]);
  const imageInputRef = useRef();
  const inputRefs = useRef([]);
  // console.log("imageFiles", imageFiles);
  const addElement = useCallback(
    (type) => {
      const newElement = {
        type,
        data: "",
        id: uuidv4(),
      };
      let previousElements = [...elements];
      let newIndex;

      if (
        focusedIndex !== null &&
        focusedIndex >= 0 &&
        focusedIndex < elements.length
      ) {
        previousElements.splice(focusedIndex + 1, 0, newElement);
        previousElements = previousElements.map((el, idx) => ({
          ...el,
          index: idx,
        }));
        newIndex = focusedIndex + 1;

        setFocusedIndex(newIndex);
      } else {
        newElement.index = elements.length;
        previousElements.push(newElement);
        newIndex = elements.length;
      }
      setImageFiles((prev) =>
        prev.map((el) => {
          if (newIndex <= el.index) {
            return { ...el, index: el.index + 1 };
          }
          return el;
        })
      );

      dispatch(setElements(previousElements));

      setTimeout(() => {
        if (inputRefs.current[newIndex]) {
          inputRefs.current[newIndex].focus();
        }
      }, 0);

      dispatch(setIsScale(false));
    },
    [elements, dispatch, focusedIndex]
  );

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const newElement = {
          type: "image",
          file: URL.createObjectURL(file),
          data: "",
          id: uuidv4(),
        };

        let previousElements = [...elements];
        let newIndex;

        if (
          focusedIndex !== null &&
          focusedIndex >= 0 &&
          focusedIndex < elements.length &&
          elements[focusedIndex].data !== ""
        ) {
          previousElements.splice(focusedIndex + 1, 0, newElement);
          previousElements = previousElements.map((el, idx) => ({
            ...el,
            index: idx,
          }));
          newIndex = focusedIndex + 1;
          setFocusedIndex(newIndex);
        } else if (
          focusedIndex !== null &&
          focusedIndex >= 0 &&
          elements[focusedIndex].data === "" &&
          !elements[focusedIndex].file
        ) {
          previousElements[focusedIndex] = newElement;
          previousElements = previousElements.map((el, idx) => ({
            ...el,
            index: idx,
          }));
          setImageFiles((prev) => [
            ...prev,
            { ...newElement, file: file, index: focusedIndex },
          ]);
        } else {
          newIndex = elements.length;
          newElement.index = newIndex;
          previousElements.push(newElement);
          setImageFiles((prev) => [
            ...prev,
            { ...newElement, file: file, index: focusedIndex + 1 },
          ]);
        }

        dispatch(setElements(previousElements));
        if (imageInputRef.current) {
          imageInputRef.current.value = null;
        }

        setTimeout(() => {
          if (inputRefs.current[newIndex]) {
            inputRefs.current[newIndex].focus();
          }
        }, 0);
      }
      dispatch(setIsScale(false));
    },
    [elements, dispatch, focusedIndex]
  );
  // console.log({ imageFiles });
  const debouncedUpdateElements = useCallback(
    debounce((updatedElements) => {
      dispatch(setElements(updatedElements));
    }),
    [dispatch]
  );
  console.log({ imageFiles });
  const handleTextChange = useCallback(
    (id, value, lang = null) => {
      const updatedElements = elements.map((el) =>
        el.id === id ? { ...el, data: value, ...(lang && { lang }) } : el
      );
      debouncedUpdateElements(updatedElements);
    },
    [elements, debouncedUpdateElements]
  );

  const handleContentEditableChange = useCallback(
    (id, event) => {
      const value = event.target.textContent;
      const updatedElements = elements.map((el) =>
        el.id === id ? { ...el, data: value } : el
      );
      dispatch(setElements(updatedElements));

      setImageFiles((prev) =>
        prev.map((el) => (el.id === id ? { ...el, data: value } : el))
      );
    },
    [elements, dispatch]
  );
  const removeElement = useCallback(
    (id) => {
      const updatedImageFiles = imageFiles
        ?.filter((el) => el.id !== id)
        .map((el, idx) => ({ ...el, index: idx }));
      setImageFiles(updatedImageFiles);

      const updatedElements = elements
        .filter((el) => el.id !== id)
        .map((el, idx) => ({ ...el, index: idx }));
      dispatch(setElements(updatedElements));

      return updatedElements.length;
    },
    [elements]
  );
  const handleKeyDown = useCallback(
    (event, id, index) => {
      console.log(event.target.innerText);
      if (
        (event.key === "Backspace" && !event.target.innerText) ||
        (event.key === "delete" && !event.target.innerText)
      ) {
        const newLength = removeElement(id);
        if (newLength < elements.length) {
          setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
        }
        setFocusedIndex(index - 1);
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addElement("text");
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
        setFocusedIndex(index + 1);
      }
    },
    [removeElement, addElement]
  );
  return {
    addElement,
    handleFileChange,
    handleTextChange,
    handleContentEditableChange,
    imageInputRef,
    inputRefs,
    imageFiles,
    setImageFiles,
    setFocusedIndex,
    focusedIndex,
    handleKeyDown,
  };
};
