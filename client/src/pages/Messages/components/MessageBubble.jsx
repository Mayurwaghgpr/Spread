import React from "react";
import { BsCheck2All } from "react-icons/bs";
import FormatedTime from "../../../component/utilityComp/FormatedTime";
import TimeAgo from "../../../component/utilityComp/TimeAgo";

const MessageBubble = ({ message, userId, readReceipt }) => {
  const isSender = message.senderId === userId;
  const isRead = readReceipt?.includes(message.id);

  return (
    <div
      className={` border-inherit max-w-[50%] w-fit  my-5 
        z-0  
      ${isSender ? "ml-auto text-end" : "mr-auto   "}
    `}
    >
      <div
        className={`relative flex flex-col gap-1 text-xs sm:text-sm  break-words w-fit  border border-inherit rounded-lg px-5 p-2  text-black  bg-light dark:bg-white
        ${isSender ? "ml-auto items-start text-start rounded-br-none " : "mr-auto items-end rounded-bl-none  "}`}
        key={message?.id}
      >
        {/* Bubble Tail */}
        <span
          className={`absolute bottom-[-0.1rem] -z-[1] w-0 h-0 border-b-[10px]  border-b-transparent border-t-transparent
          ${isSender ? "right-[-10px] border-l-[10px] border-l-light dark:border-l-white" : "left-[-10px] border-r-[10px] border-r-light dark:border-r-white"}`}
        ></span>

        <p className=" w-full">{message.content}</p>

        <div className="flex items-center gap-2">
          {isSender && (
            <BsCheck2All
              className={`text-[1rem] ${isRead ? "text-blue-500" : "text-gray-400"}`}
            />
          )}
        </div>
      </div>
      <TimeAgo
        className="text-[0.5rem] opacity-70 px-3"
        date={message.createdAt}
      />
    </div>
  );
};

export default MessageBubble;
