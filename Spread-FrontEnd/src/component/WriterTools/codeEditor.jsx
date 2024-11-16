import React, { useState, useRef } from "react";
import Selector from "../otherUtilityComp/Selector";
import Editor from "@monaco-editor/react";
import { useSelector } from "react-redux";

function CodeEditor({
  element,
  index,
  handleKeyDown,
  inputRefs,
  handleTextChange,
  setFocusedIndex,
}) {
  const [language, setLanguage] = useState("javascript");
  const { ThemeMode } = useSelector((state) => state.ui);

  // Ref to hold the Monaco editor instance
  const editorRef = useRef(null);

  const languages = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "CSS", value: "css" },
    { name: "HTML", value: "markup" },
  ];

  // Function to handle Monaco editor's mount event
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor; // Save the editor instance
  };

  return (
    <div
      className="p-5 border flex flex-col gap-5 overflow-scroll h-[30rem] w-full focus:border-green-200 outline-none"
      onFocus={() => setFocusedIndex(index)}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e) => {
        if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete") {
          handleKeyDown(e, element.id, index);
        }
      }}
      ref={(editor) => (inputRefs.current[index] = editor)} // Assign ref to the editor container
    >
      <Selector
        className="p-2 border z-10 outline-none rounded max-w-[10rem] text-xs"
        options={languages}
        setOptions={setLanguage}
      />
      <Editor
        height="500px"
        language={language}
        value={element.data}
        theme={ThemeMode ? "vs-dark" : "light"}
        onMount={handleEditorDidMount} // Save Monaco editor instance
        onChange={(value) => handleTextChange(element.id, value, language)}
      />
    </div>
  );
}

export default CodeEditor;
