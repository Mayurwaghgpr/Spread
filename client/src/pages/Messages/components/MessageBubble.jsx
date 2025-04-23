import React from "react";
import { BsCheck2All } from "react-icons/bs";
import FormatedTime from "../../../component/utilityComp/FormatedTime";
import TimeAgo from "../../../component/utilityComp/TimeAgo";

const MessageBubble = ({ message, userId, readReceipt }) => {
  const isSender = message.senderId === userId;
  const isRead = readReceipt?.includes(message.id);

  return (
    <div
      className={`relative flex flex-col gap-1 text-xs sm:text-sm max-w-[50%] break-words w-fit my-5 border border-inherit rounded-lg  bg-[#fff9f3] dark:bg-black
        ${isSender ? "ml-auto items-start text-start rounded-tr-none  pr-5  p-2" : "mr-auto items-end rounded-tl-none  pl-5  p-2"}`}
      key={message?.id}
    >
      {/* Bubble Tail */}
      <span
        className={`absolute top-[-0.1rem] -z-[1] w-0 h-0 border-b-[10px] border-b-transparent border-t-transparent
          ${isSender ? "right-[-10px] border-l-[10px] border-l-inherit" : "left-[-10px] border-r-[10px] border-r-inherit"}`}
      ></span>

      <p className=" w-full">{message.content}</p>

      <div className="flex items-center gap-2">
        {isSender && (
          <BsCheck2All
            className={`text-[1rem] ${isRead ? "text-blue-500" : "text-gray-400"}`}
          />
        )}
        <TimeAgo
          className="text-[0.5rem] opacity-25"
          date={message.createdAt}
        />
      </div>
    </div>
  );
};

export default MessageBubble;
