import React from "react";
import { useNavigate } from "react-router-dom";

function MessageFallBack() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-start gap-3 w-[80%] p-32 pt-0 h-full ">
      <h1 className="text-3xl font-bold ">
        Select a conversation to start chatting
      </h1>
      <p className=" text-gray-500 dark:text-gray-400">
        You can create a new conversation by clicking on the +Icon button or
        chose from existing conversations on the left.
      </p>
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-700 transition-colors"
        onClick={() => navigate("new/c")}
      >
        Start New Conversation
      </button>
    </div>
  );
}

export default MessageFallBack;
