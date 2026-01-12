import React, { useState, useRef } from "react";
import { useCallback } from "react";
import { lazy } from "react";
import { useSelector } from "react-redux";
const Selector = lazy(() => import("../../../components/utilityComp/Selector"));
const Editor = lazy(() => import("@monaco-editor/react"));

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

  const languages = ["JavaScript", "Python", "CSS", "HTML"];

  // Function to handle Monaco editor's mount event
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor; // Save the editor instance
  };
  // Handle editor content change
  const handleEditorChange = useCallback(
    (value) => {
      handleTextChange(element.id, value || "", language);
    },
    [element.id, language, handleTextChange]
  );
  console.log(language);
  return (
    <header
      className="p-5 border flex flex-col gap-5 overflow-scroll h-[30rem] w-full border-inherit outline-none"
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
      {" "}
      <header className="flex justify-between items-center">
        <Selector
          className="p-2 border z-10 outline-none bg-inherit border-inherit rounded max-w-[10rem] text-xs"
          options={languages}
          setOptions={setLanguage}
        />
        <div className="text-xs capitalize text-gray-500">{language}</div>
      </header>
      <div className="h-full" onKeyDown={(e) => e.stopPropagation()}>
        <Editor
          height="100%"
          language={language}
          value={element.data || ""}
          theme={ThemeMode ? "vs-dark" : "light"}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            fontSize: 14,
            fontFamily: "Monaco, 'Courier New', monospace",
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: "selection",
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </header>
  );
}

export default CodeEditor;
