import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setElements } from "../../../store/slices/postSlice";
import { debounce } from "../../../utils/debounce";

export const usePostCreator = () => {
  const { elements } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [focusedIndex, setFocusedIndex] = useState(elements.length);
  const [imageFiles, setImageFiles] = useState([]);
  const imageInputRef = useRef();
  const inputRefs = useRef([]);
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

      // dispatch(setIsScale(false));
    },
    [elements, focusedIndex]
  );

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const newElement = {
        type: "image",
        file: URL.createObjectURL(file),
        data: "",
        id: uuidv4(),
      };

      let updatedElements = [...elements];
      let newIndex;

      if (
        focusedIndex !== null &&
        focusedIndex >= 0 &&
        focusedIndex < elements.length
      ) {
        const focusedElement = elements[focusedIndex];
        if (focusedElement.data !== "") {
          newIndex = focusedIndex + 1;
          updatedElements.splice(newIndex, 0, newElement);
        } else if (!focusedElement.file) {
          newIndex = focusedIndex;
          updatedElements[focusedIndex] = newElement;
        }
      }
      if (newIndex === undefined) {
        newIndex = updatedElements.length;
        updatedElements.push(newElement);
      }

      updatedElements = updatedElements.map((el, index) => ({ ...el, index }));

      dispatch(setElements(updatedElements));
      setImageFiles((prev) => [
        ...prev,
        { ...newElement, file, index: newIndex },
      ]);

      if (imageInputRef.current) imageInputRef.current.value = null;

      setTimeout(() => {
        if (inputRefs.current[newIndex]) {
          inputRefs.current[newIndex].focus();
        }
      }, 0);
    },
    [elements, dispatch, focusedIndex]
  );

  const debouncedUpdateElements = useCallback(
    debounce((updatedElements) => {
      dispatch(setElements(updatedElements));
    }),
    [dispatch]
  );
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

      // if (elements.length < 1) {
      //   dispatch(setElements({ type, data: "", id: uuidv4(), index: 0 }));
      // }
      return updatedElements.length;
    },
    [elements]
  );
  const handleKeyDown = useCallback(
    (event, id, index, tag) => {
      const isEmpty =
        tag === "p"
          ? event.target.innerText.startsWith("\n") ||
            event.target.innerText.startsWith("<br/>") ||
            !event.target.innerText
          : !event.target.value;
      // it checks if previos input have no content
      if (event.type === "click") {
        const newLength = removeElement(id);
        if (newLength < elements.length) {
          setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
        }
        setFocusedIndex(index - 1);
      } else if (event.key == "Backspace" && isEmpty) {
        // console.log({ event });
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
