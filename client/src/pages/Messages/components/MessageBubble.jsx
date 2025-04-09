import React from "react";
import { BsCheck2All } from "react-icons/bs";
import FormatedTime from "../../../component/utilityComp/FormatedTime";

const MessageBubble = ({ message, userId, readReceipt }) => {
  const isSender = message.senderId === userId;
  const isRead = readReceipt?.includes(message.id);

  return (
    <div
      className={`relative flex flex-col gap-1 text-xs sm:text-sm max-w-[50%] px-5 p-1 my-16 border border-inherit rounded-lg shadow-sm bg-[#fff9f3] dark:bg-black
        ${isSender ? "ml-auto items-start text-end rounded-tr-none" : "mr-auto items-end rounded-tl-none"}`}
      key={message?.id}
    >
      {/* Bubble Tail */}
      <span
        className={`absolute top-[-0.1rem] -z-[1] w-0 h-0 border-b-[10px] border-b-transparent border-t-transparent
          ${isSender ? "right-[-10px] border-l-[10px] border-l-inherit" : "left-[-10px] border-r-[10px] border-r-inherit"}`}
      ></span>

      <p>
        {message.content} Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Obcaecati veniam odit ut, blanditiis reiciendis iure porro ducimus
        corrupti? Ea ex, hic repellendus itaque quas magni modi velit rerum
        exercitationem provident!
      </p>

      <span className="flex items-center gap-2">
        {isSender && (
          <BsCheck2All
            className={`text-[1rem] ${isRead ? "text-blue-500" : "text-gray-400"}`}
          />
        )}
        <FormatedTime
          className="text-[0.5rem] opacity-25"
          date={message.createdAt}
          formate="hb"
        />
      </span>
    </div>
  );
};

export default MessageBubble;
