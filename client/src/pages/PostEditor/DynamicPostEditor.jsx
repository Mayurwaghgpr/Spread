import { useEffect } from "react";
import ElementsProvider from "./components/ElementsProvider";
import { usePostCreator } from "./hooks/usePostCreator";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import InputTypeSelector from "./components/InputTypeSelector";
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
  const navigate = useNavigate();
  const icons = useIcons();

  const canPublish = elements.length >= 2 && elements[0]?.data?.trim() !== "";

  // Keyboard shortcut: Cmd/Ctrl + Enter to continue
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (canPublish) {
          e.preventDefault();
          navigate("/write/publish");
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [canPublish, navigate]);

  return (
    <div className="relative flex flex-col w-full min-h-screen border-inherit bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36">
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 backdrop-blur-md flex items-center justify-between border-b border-stone-200/60 dark:border-stone-800/60 bg-stone-50/80 dark:bg-stone-950/80">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
          title="Exit editor and return to home"
          aria-label="Exit editor"
        >
          <span className="w-4 h-4 flex items-center justify-center">{icons.arrowL}</span>
          <span>Exit Editor</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center text-[11px] font-medium text-stone-400 dark:text-stone-500">
            {canPublish ? "Ready to publish" : "Draft • In progress"}
          </span>

          <button
            type="button"
            onClick={() => navigate("/write/publish")}
            disabled={!canPublish}
            title={
              !canPublish
                ? "Add a title and some story content to continue"
                : "Proceed to preview & publish (Ctrl+Enter)"
            }
            aria-label={
              !canPublish
                ? "Add title and content to continue"
                : "Continue to publish"
            }
            className={`spread-btn-primary text-xs font-bold px-5 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition-all ${
              canPublish
                ? "hover:scale-105 opacity-100 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <span>Continue</span>
            <span className="w-3.5 h-3.5 flex items-center justify-center">{icons.sendFi}</span>
          </button>
        </div>
      </header>

      {/* Main Writing Canvas */}
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-4 border-inherit">
        {elements.map((element, index) => (
          <div
            key={element.id}
            className="relative flex items-center w-full border-inherit group"
          >
            <div className="w-full min-h-[2.5rem] border-inherit">
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
      </main>

      {/* Bottom Media Insertion Toolbar */}
      <InputTypeSelector
        imageInputRef={imageInputRef}
        addElement={addElement}
        handleFileChange={handleFileChange}
      />

      <Outlet context={[imageFiles, setImageFiles, handleTextChange]} />
    </div>
  );
}

export default DynamicPostEditor;
