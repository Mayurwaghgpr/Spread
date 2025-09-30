import React from "react";
import { useNavigate } from "react-router-dom";

function ConversationFallBack() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-start gap-3 w-[80%] p-32 pt-0 h-full ">
      <h1 className="text-3xl font-bold ">
        Select a conversation to start interaction with users
      </h1>
      <p className=" opacity-30 font-thin text-sm">
        You can create a new conversation by clicking on the +Icon button or
        chose from existing conversations on the left.
      </p>
      <button
        className="px-4 py-2 dark:bg-white bg-black text-white dark:text-black rounded-full hover:opacity-80 transition-all duration-300"
        onClick={() => navigate("new/c")}
      >
        Start New Conversation
      </button>
    </div>
  );
}

export default ConversationFallBack;
