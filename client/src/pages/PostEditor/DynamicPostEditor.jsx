import ElementsProvider from "./components/ElementsProvider";
import { usePostCreator } from "./hooks/usePostCreator";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import InputTypeSelector from "./components/InputTypeSelector";
import { Send, ArrowLeft, Sparkles } from "lucide-react";

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

  const canPublish = elements.length >= 2 && elements[0]?.data?.trim() !== "";

  return (
    <div className="relative flex flex-col w-full min-h-screen border-inherit bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36">
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-30 w-full  px-4 sm:px-8 py-3.5 backdrop-blur-md flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Editor</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/write/publish")}
          disabled={!canPublish}
          className={`spread-btn-primary text-xs font-bold px-5 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition-all ${canPublish
            ? "hover:scale-105 opacity-100 cursor-pointer"
            : "opacity-40 cursor-not-allowed"
            }`}
        >
          <span>Continue</span>
          <Send className="w-3.5 h-3.5" />
        </button>
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
