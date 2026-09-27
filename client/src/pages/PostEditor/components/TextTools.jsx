import { memo, useMemo, useState } from "react";
import useIcons from "../../../hooks/useIcons";

const TextTools = ({ position, applyStyle }) => {
  const [url, setUrl] = useState("");
  const [isInputVisible, setInputVisible] = useState(false);
  const [savedRange, setSavedRange] = useState(null);
  const icons = useIcons();

  if (!position) return null;
  const { x, y } = position;

  const handleShowInput = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
      setInputVisible(true);
    }
  };

  const executeCreateLink = (targetUrl) => {
    if (!targetUrl || !savedRange) return;

    let formattedUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const anchor = document.createElement("a");
    anchor.href = formattedUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("contenteditable", "false");
    anchor.classList.add(
      "text-stone-900",
      "dark:text-stone-100",
      "underline",
      "underline-offset-4",
      "hover:opacity-80",
      "cursor-pointer"
    );
    anchor.textContent = savedRange.toString();

    savedRange.deleteContents();
    savedRange.insertNode(anchor);

    setInputVisible(false);
    setUrl("");
    setSavedRange(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCreateLink(url);
    } else if (e.key === "Escape") {
      setInputVisible(false);
    }
  };

  const options = useMemo(
    () => [
      {
        action: () => applyStyle("Bold", null),
        icon: icons.bold,
        label: "Bold",
      },
      {
        action: () => applyStyle("Italic", null),
        icon: icons.italic,
        label: "Italic",
      },
      {
        action: () => applyStyle("Underline", null),
        icon: icons.underline,
        label: "Underline",
      },
      {
        action: handleShowInput,
        icon: icons.link,
        label: "Add Link",
      },
    ],
    [applyStyle, icons]
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute z-50 transition-all duration-200 animate-in fade-in zoom-in-95"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -130%)",
        whiteSpace: "nowrap",
      }}
    >
      <div className="relative spread-card p-1.5 rounded-2xl border border-stone-800 shadow-2xl backdrop-blur-xl bg-stone-900/95 text-stone-100 flex items-center gap-1">
        {/* Floating Triangle Arrow Pointer */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-stone-900 border-b border-r border-stone-800" />

        {isInputVisible ? (
          <div className="flex items-center gap-2 px-1 py-0.5">
            <span className="w-3.5 h-3.5 text-stone-400 shrink-0 flex items-center justify-center">
              {icons.link}
            </span>
            <input
              placeholder="Paste or type URL..."
              className="bg-transparent text-xs text-stone-100 placeholder:text-stone-500 outline-none w-48 py-1 font-medium"
              type="text"
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => executeCreateLink(url)}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Apply Link"
              aria-label="Apply Link"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center">{icons.check}</span>
            </button>
            <button
              type="button"
              onClick={() => setInputVisible(false)}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
              title="Cancel"
              aria-label="Cancel"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center">{icons.close}</span>
            </button>
          </div>
        ) : (
          options.map(({ action, icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              aria-label={label}
              title={label}
              className="p-2 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-stone-100 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            >
              <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(TextTools);
