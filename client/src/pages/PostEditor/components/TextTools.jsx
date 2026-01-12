import React, { memo, useMemo, useState } from "react";
import Ibutton from "../../../components/buttons/Ibutton";
import useIcons from "../../../hooks/useIcons";

const TextTools = ({ position, applyStyle }) => {
  const [url, setUrl] = useState("");
  const icons = useIcons();
  const [isInputVisible, setInputVisible] = useState(false);
  const [savedRange, setSavedRange] = useState(null); // Store selection range

  if (!position) return null;
  const { x, y } = position;

  // Store selection before opening input
  const handleShowInput = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0)); // Save selection
      setInputVisible(true);
    }
  };

  const handleCreateLink = (e) => {
    if (e.key === "Enter" && url.trim() && savedRange) {
      const anchor = document.createElement("a");
      anchor.href = url.trim();
      anchor.target = "_blank"; // Open in new tab
      anchor.rel = "noopener noreferrer";

      // Prevent contentEditable from interfering
      anchor.setAttribute("contenteditable", "false");
      anchor.classList // Add multiple classes
        .add(
          "text-blue-800",
          "underline",
          "hover:text-blue-500",
          "cursor-pointer"
        );
      anchor.textContent = savedRange.toString(); // Keep selected text

      savedRange.deleteContents(); // Remove selected text
      savedRange.insertNode(anchor); // Insert the link

      setInputVisible(false);
      setUrl("");
      setSavedRange(null); // Reset saved range
    }
  };

  const options = useMemo(
    () => [
      {
        action: () => applyStyle("Bold", null),
        icon: "B",
        className: "flex justify-center items-center border-black w-full",
      },
      {
        action: () => applyStyle("Underline", null),
        icon: "U",
        className: "flex justify-center items-center border-black w-full",
      },
      {
        action: handleShowInput, // Show input field when clicking the link button
        icon: icons["link"],
        className:
          "flex justify-center items-center border-black w-full text-xl",
      },
      {
        action: () => applyStyle("Italic", null),
        icon: "I",
        className: "flex justify-center items-center border-black w-full ",
      },
    ],
    [applyStyle]
  );

  return isInputVisible ? (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex justify-evenly items-center gap-2 border p-2 bg-white dark:bg-black rounded-md transition-transform duration-100 z-50 absolute"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -120%)",
        whiteSpace: "nowrap",
      }}
    >
      <input
        placeholder="Enter URL"
        className="w-full bg-inherit placeholder:text-inherit outline-none p-1 rounded-sm"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleCreateLink}
      />
      <button onClick={() => setInputVisible(false)}>{icons["close"]}</button>
    </div>
  ) : (
    <div
      className="bg-white  animate-fedin.2s  dark:bg-black border justify-evenly items-center p-2 px-5 rounded-md transition-transform duration-100 z-40 absolute"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -120%)",
        whiteSpace: "nowrap",
      }}
    >
      <div className="flex w-full items-center gap-3 justify-between">
        {options.map((option, idx) => (
          <span key={idx} className={option.className}>
            <Ibutton action={option.action}>{option.icon}</Ibutton>
          </span>
        ))}
      </div>
    </div>
  );
};

export default memo(TextTools);
