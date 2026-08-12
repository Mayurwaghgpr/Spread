import React, { useState, useRef, useCallback, lazy, Suspense } from "react";
import Spinner from "../../../components/loaders/Spinner";
import { Code2, ChevronDown } from "lucide-react";

const Editor = lazy(() => import("@monaco-editor/react"));

const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
];

const CodeEditor = ({ content = {}, onUpdate }) => {
  const [language, setLanguage] = useState(content?.lang || "javascript");
  const [code, setCode] = useState(content?.code || "// Write code snippet here...\n");
  const editorRef = useRef(null);

  const handleEditorChange = useCallback(
    (value) => {
      const newCode = value || "";
      setCode(newCode);
      if (onUpdate) {
        onUpdate({ code: newCode, lang: language });
      }
    },
    [language, onUpdate]
  );

  const handleLanguageChange = useCallback(
    (e) => {
      const newLang = e.target.value;
      setLanguage(newLang);
      if (onUpdate) {
        onUpdate({ code, lang: newLang });
      }
    },
    [code, onUpdate]
  );

  return (
    <div className="w-full spread-card rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden backdrop-blur-xl bg-stone-900 text-stone-100 my-4">
      {/* Chrome Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/80 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-stone-600/80" />
            <div className="w-3 h-3 rounded-full bg-stone-500/80" />
            <div className="w-3 h-3 rounded-full bg-stone-400/80" />
          </div>
          <span className="text-xs font-bold text-stone-400 flex items-center gap-1.5 ml-2">
            <Code2 className="w-3.5 h-3.5 text-stone-400" />
            Code Block
          </span>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative flex items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-semibold px-3 py-1 pr-7 rounded-lg border border-stone-700 outline-none cursor-pointer transition-colors"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-stone-900 text-stone-200">
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* Monaco Canvas */}
      <div className="w-full min-h-[160px] sm:min-h-[220px]">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-40">
              <Spinner className="w-6 h-6 text-stone-100" />
            </div>
          }
        >
          <Editor
            height="220px"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "Fira Code, JetBrains Mono, monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(CodeEditor);
