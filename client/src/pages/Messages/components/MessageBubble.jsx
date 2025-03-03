import React from "react";
import { BsCheck2All } from "react-icons/bs";
import FormatedTime from "../../../component/utilityComp/FormatedTime";

const MessageBubble = ({ message, userId, readReceipt }) => {
  return (
    <p
      onCapt
      className={` flex flex-col gap-1 w-fit p-1 px-3 text-sm rounded-2xl  my-3  ${
        message.senderId === userId
          ? "ml-auto bg-sky-400 text-white dark:shadow-sky-400 rounded-br-none "
          : "mr-auto bg-[#fffefe]  items-end text-black dark:shadow-white rounded-bl-none"
      }  `}
      key={message?.id}
    >
      <span>{message.content}</span>
      <span className={`flex items-center justify-between`}>
        {" "}
        {message.senderId === userId && <BsCheck2All />}
        <FormatedTime className="text-[.5rem]" date={message.createdAt} />
      </span>
    </p>
  );
};

export default MessageBubble;
