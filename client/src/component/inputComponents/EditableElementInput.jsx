import React, { memo, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import UserNamesSuggestion from "../UserNamesSuggestion";

const EditableElementInput = React.forwardRef(
  (
    {
      value = "",
      onChange,
      placeholder = "Write something...",
      maxWidth = "70%",
      className = "",
      textClassName = "",
      borderColor = "border-black dark:border-white",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mentionedUsername, setMentionedUsername] = useState("");
    const [selectedUser, setSelectUserData] = useState({});
    useEffect(() => {
      if (ref?.current && value !== ref.current.innerText) {
        ref.current.innerHTML = DOMPurify.sanitize(value);
      }
    }, [value, ref]);

    const handleInput = (element) => {
      const text = element.innerText;
      // Highlight mentions with @username
      if (!text) {
        element.innerHTML = ""; // Clear if empty
        return;
      }
      const textInclutesAt = text.includes("@");
      if (textInclutesAt) {
        setIsOpen(true);
        const foundMentions = text.match(/@(\w+)/g); // Find all mentions starting with '@'
        if (foundMentions) {
          setMentionedUsername(foundMentions[0]?.substring(1)); // Extract username after '@'
        }
        const highlightedHTML = DOMPurify.sanitize(
          text.replace(/@(\w+)/g, '<span class="text-blue-500">@$1</span>')
        );

        // Keep caret position (optional enhancement, can be complex)
        // Set HTML and call onChange with original text
        element.innerHTML = highlightedHTML;

        placeCaretAtEnd(element); // optional: maintain cursor position
      } else {
        setIsOpen(false);
        setMentionedUsername("");
      }
      //   const foudMentions = text.match(/@(\w+)/g); // Find all mentions starting with '@'

      onChange?.(text); // plain text (if needed for state)
    };
    console.log(mentionedUsername);

    function placeCaretAtEnd(el) {
      const range = document.createRange();
      console.log({ range });
      const sel = window.getSelection();
      console.log({ sel });
      range.selectNodeContents(el);

      range.collapse(false);
      console.log({ range, sel });
      sel.removeAllRanges();
      sel.addRange(range);
    }

    return (
      <>
        {" "}
        <div
          className={`relative flex flex-wrap justify-start items-start w-full text-wrap break-words text-sm border-inherit ${className}`}
          style={{ maxWidth }}
        >
          {isOpen && (
            <UserNamesSuggestion
              mentionedUsername={mentionedUsername}
              selectUserData={setSelectUserData}
            />
          )}
          <p
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            className={`w-full bg-inherit border-inherit outline-none p-2 text-inherit peer ${textClassName}`}
            placeholder={placeholder}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(value),
            }}
            onInput={(e) => handleInput(e.currentTarget)}
          />
          <div
            className={`absolute w-full bottom-0 transition-transform duration-300 border-t ${borderColor} scale-0 peer-focus:scale-100`}
          />
        </div>
      </>
    );
  }
);

export default memo(EditableElementInput);
