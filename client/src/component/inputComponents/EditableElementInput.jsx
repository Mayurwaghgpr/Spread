import React, { memo, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { lazy } from "react";
import { Suspense } from "react";
import Spinner from "../loaders/Spinner";
const UserNamesSuggestion = lazy(() => import("../UserNamesSuggestion"));

const EditableElementInput = React.forwardRef(
  (
    {
      value,
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
      const mentionMatch = text.match(/@(\w+)$/); // Only match @word at the end (no space after word)
      const textIncludesAt = mentionMatch !== null;

      // console.log(text);
      onChange?.(element.innerHTML); // plain text (if needed for state)
      if (textIncludesAt) {
        setIsOpen(true);
        if (mentionMatch) {
          setMentionedUsername(mentionMatch[0]?.substring(1)); // Extract username after '@'
        }
        placeCaretAtEnd(element); // optional: maintain cursor position
      } else {
        setIsOpen(false);
        setMentionedUsername("");
      }
    };

    function placeCaretAtEnd(el) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);

      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    // Handle mention insertion
    useEffect(() => {
      if (
        !selectedUser?.username ||
        !elementRef?.current ||
        !mentionedUsername
      ) {
        return;
      }
      const currentText = ref.current.innerHTML;
      const mentionLink = `<a href="/profile/@${selectedUser.username}/${selectedUser.id}" class="text-blue-500 hover:text-blue-600 cursor-pointer font-medium" data-mention="true">@${selectedUser.username}</a>`;
      const updatedText = currentText.replace(
        `@${mentionedUsername}`,
        mentionLink
      );
      ref.current.innerHTML = updatedText;
      onChange?.(updatedText);
      setIsOpen(false);
      setMentionedUsername("");
      setSelectUserData({});
    }, [selectedUser, mentionedUsername]);

    return (
      <>
        {" "}
        <div
          className={`relative flex flex-wrap justify-start items-start w-full text-wrap break-words text-sm border-inherit ${className}`}
          style={{ maxWidth }}
        >
          <Suspense
            fallback={
              <Spinner className={"w-8 h-8 p-1 bg-black dark:bg-white"} />
            }
          >
            {isOpen && (
              <UserNamesSuggestion
                mentionedUsername={mentionedUsername}
                selectUserData={setSelectUserData}
              />
            )}
          </Suspense>
          <p
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            className={`w-full bg-inherit border-inherit outline-none p-2 text-inherit peer ${textClassName} before:content-[attr(data-placeholder)] before:absolute before:inset-0 before:opacity-50 before:pointer-events-none focus:before:content-[''] peer-focus:before:content-['']`}
            style={{ maxWidth }}
            inputMode="text"
            aria-label={placeholder}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(value),
            }}
            onInput={(e) => handleInput(e.currentTarget)}
          />
          <div
            className={`absolute w-full bottom-0 transition-transform duration-300 border-inherit border-t ${borderColor} scale-0 peer-focus:scale-100`}
          />
        </div>
      </>
    );
  }
);

export default memo(EditableElementInput);
