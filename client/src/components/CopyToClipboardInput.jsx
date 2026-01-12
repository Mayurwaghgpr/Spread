import React, { useCallback, useRef, useState } from "react";
const SyntaxHighlighter = lazy(() => import("react-syntax-highlighter"));
import {
  dark,
  lightfair,
  irBlack,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { FaCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { lazy } from "react";
import useIcons from "../hooks/useIcons";
const CopyToClipboardInput = ({ item }) => {
  const [copySuccess, setCopySuccess] = useState("");
  const contentref = useRef();
  const icons = useIcons();
  const { ThemeMode } = useSelector((state) => state.ui);
  const handleCopyClick = useCallback(() => {
    const inputValue =
      item.type === "url"
        ? contentref.current.innerText
        : contentref.current.textContent;

    navigator.clipboard.writeText(inputValue).then(
      () => setCopySuccess("Copied code !"),
      () => setCopySuccess("Failed to copy.")
    );
    let timeout = setTimeout(() => {
      setCopySuccess("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [item.type]);

  return (
    <pre className={`border rounded-lg border-inherit`}>
      <div className="w-full  min-h-[2.5rem] flex justify-end rounded-t-lg bg-light dark:bg-dark "></div>
      <div className="sticky top-[7rem] w-full ">
        <div className="absolute bottom-0 right-2 flex h-7 mb-1  items-center dark:bg-[#3c3c3c] bg-[#faf5f0] rounded-lg text-xs ">
          <button
            className="flex  w-full  px-4  justify-center items-center gap-3  "
            onClick={handleCopyClick}
          >
            {copySuccess ? (
              <span className=" rounded-md  flex gap-2 items-center  ">
                <FaCheck />
                {icons["done"]}
                {copySuccess}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {" "}
                {icons["code1"]}
                Copy code
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="w-full shadow-inner rounded-b-lg">
        {
          <div className=" rounded-b-lg overflow-hidden  " ref={contentref}>
            {item.type === "code" ? (
              <SyntaxHighlighter
                language={item.lang}
                style={ThemeMode === "dark" ? irBlack : lightfair}
                wrapLines={true}
                showLineNumbers={true}
              >
                {item.content}
              </SyntaxHighlighter>
            ) : (
              <p className="w-full h-full"> {item.content}</p>
            )}
          </div>
        }
      </div>
    </pre>
  );
};

export default CopyToClipboardInput;
