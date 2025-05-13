import DOMPurify from "dompurify";
import React, { useMemo } from "react";
import { TiArrowSync } from "react-icons/ti";
import { Link, useParams } from "react-router-dom";
import userImageSrc from "../../utils/userImageSrc";

import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const AIResponse = ({
  data,
  aiError,
  isAnalyzing,
  setshow,
  mutate,
  postData,
}) => {
  const { id } = useParams();
  const userImage = useMemo(
    () => userImageSrc(postData?.User),
    [postData?.User]
  );
  return (
    <div className=" right-5 animate-fedin1s bg-light dark:bg-dark w-full max-w-4xl h-full overflow-hidden border-inherit">
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
        <div className="flex items-center gap-6 text-2xl ">
          <button
            onClick={() => mutate({ id })}
            className="flex justify-center items-center w-10 h-10 "
          >
            <TiArrowSync
              title=""
              className={` m-auto opacity-30 hover:opacity-100 cursor-pointer`}
            />
          </button>
          <button
            onClick={() => setshow(false)}
            className="flex justify-center items-center "
          >
            <MdKeyboardDoubleArrowLeft
              className="opacity-30 hover:opacity-100
            transition duration-300 cursor-pointer "
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
        <div
          className={` border p-3 rounded-lg  border-inherit    ${isAnalyzing ? "ai-scanning" : ""}`}
        >
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
      <ul className="flex animate-fedin1s flex-col items-start  gap-4 px-6 py-4 min-h-screen typewriter">
        {isAnalyzing && (
          <div className=" flex justify-center bg-white p-2 w-[3rem] shadow-sm rounded-lg rounded-tl-sm">
            <div className="dotloader "></div>
          </div>
        )}
        {!aiError ? (
          data?.map((points, idx) => {
            if (typeof points === "object") {
              return (
                <div>
                  <Link
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    to={points.resource}
                  >
                    {points.description}
                  </Link>
                </div>
              );
            } else {
              return (
                <li
                  key={idx}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(points),
                  }}
                  className="list-disc text-[15px] leading-relaxed"
                >
                  {}
                </li>
              );
            }
          })
        ) : (
          <div className=" text-xs text-red-400 border border-red-500 p-3 rounded-full bg-opacity-5 backdrop-blur-sm bg-red-400">
            <span>{aiError.data}</span>
          </div>
        )}
      </ul>
    </div>
  );
};

export default AIResponse;
