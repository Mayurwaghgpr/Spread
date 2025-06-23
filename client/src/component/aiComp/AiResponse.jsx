import DOMPurify from "dompurify";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TiArrowSync } from "react-icons/ti";
import userImageSrc from "../../utils/userImageSrc";

import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const AIResponse = () => {
  const [aiStreamText, setAiStreamText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState();
  const [isStreaming, setIsStreaming] = useState(true);
  const controllerRef = React.useRef(null);
  const navigate = useNavigate();
  const {
    state: { postData },
  } = useLocation();
  // const { id } = useParams();
  const userImage = useMemo(
    () => userImageSrc(postData?.User),
    [postData?.User]
  );
  // Reference for cancellation
  const fetchStream = useCallback(async () => {
    setIsAnalyzing(true);
    setAiStreamText("");
    setError(null);
    setIsStreaming(true);
    // Create a new AbortController for this request
    const controller = new AbortController();
    controllerRef.current = controller; // Store the controller in a ref for later use
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/ai/analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post: postData }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error("AI analysis failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        setIsStreaming(!streamDone);
        setIsAnalyzing(false);

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setAiStreamText((prev) => prev + chunk);
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Streaming error");
      }
    }
  }, []);

  useEffect(() => {
    if (!postData?.title) return;

    fetchStream();
    // Cleanup function to abort the fetch request if the component unmounts
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [postData?.title]);
  return (
    <div className="flex items-center justify-center w-full my-16 border-inherit">
      <div className="animate-fedin1s bg-light dark:bg-dark w-full max-w-4xl h-full overflow-hidden border-inherit">
        {/* Header */}
        <header className="border-b border-inherit flex justify-between items-center p-4">
          {isAnalyzing ? (
            <h1 className="font-bold shimmer-effect dark:shimmer-effect-dark">
              Analyzing post
            </h1>
          ) : (
            <h1 className="text-lg font-semibold tracking-wide">
              AI Explanation
            </h1>
          )}
          <div className="flex items-center gap-6 text-2xl  *:transition-all *:duration-300">
            <button
              onClick={() => fetchStream()}
              disabled={isAnalyzing}
              title="Refresh"
              aria-label="Refresh"
              type="button"
              className="flex justify-center items-center w-10 h-10 *:transition-all *:duration-300 "
            >
              <TiArrowSync
                className={` m-auto opacity-30 hover:opacity-100 cursor-pointer`}
              />
            </button>
            <button
              onClick={() => navigate(-1, { replace: true })}
              title="Back"
              aria-label="Back"
              type="button"
              className="flex justify-center items-center font-thin  *:transition-all *:duration-300"
            >
              <MdKeyboardDoubleArrowLeft
                className="opacity-30 hover:opacity-100
            cursor-pointer "
              />
            </button>
          </div>
        </header>{" "}
        <div className="flex  items-start gap-5  p-3 border-inherit">
          <div className="w-10 h-10">
            {" "}
            <img
              alt={`${postData?.User?.username}`}
              src={userImage.userImageurl}
              className="w-full h-full rounded-full mr-4 object-cover object-top"
              loading="lazy"
            />
          </div>
          <div className={` border p-3 rounded-lg  border-inherit`}>
            <div className="flex -space-x-4 border-[#fff9f3] dark:border-black">
              <img
                className="w-10 h-10 z-10 rounded-full object-fill object-center border-2 border-inherit "
                src={`${postData?.titleImage}`}
                alt="Title Image"
                loading="lazy"
              />
              {postData.postContent?.map((item, idx) => {
                if (item.type !== "image") return null;
                return (
                  <img
                    key={item.id || idx}
                    src={item?.content}
                    alt="Content"
                    style={{ zIndex: Math.max(0, 8 - idx) }}
                    className="w-10 h-10 rounded-full object-cover object-center border-2 border-inherit"
                    loading="lazy"
                  />
                );
              })}
            </div>
            <div className="p-3 text-sm">
              <h1>{postData?.title}</h1>
              <h2 className="text-black dark:text-white text-opacity-40 dark:text-opacity-30 ">
                {postData?.subtitelpagraph}
              </h2>
            </div>
          </div>
        </div>
        {/* AI Explanation Points */}
        {/* <ul className="flex animate-fedin1s flex-col items-start  gap-4 px-6 py-4 min-h-screen typewriter"> */}
        {/* {isAnalyzing && (
          <div className=" flex justify-center bg-white p-2 w-[3rem] shadow-sm rounded-lg rounded-tl-sm">
            <div className="dotloader "></div>
          </div>
        )} */}
        {!error ? (
          <div className="w-full  transition-all duration-1000 ease-linear animate-typewriter text-sm ">
            {" "}
            <div
              className="prose dark:prose-invert leading-relaxed text-black dark:text-white"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(aiStreamText),
              }}
            ></div>
            {isStreaming && (
              <span className="block w-1 h-1 p-1 rounded-full bg-black dark:bg-white animate-pulse">
                &nbsp;
              </span>
            )}
          </div>
        ) : (
          <div className=" text-xs text-red-400 border border-red-500 p-3 rounded-full bg-opacity-5 backdrop-blur-sm bg-red-400">
            <span>{error.data || "An error occurred"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResponse;
