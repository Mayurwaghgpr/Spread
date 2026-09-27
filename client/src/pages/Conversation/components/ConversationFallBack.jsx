import React from "react";
import { useNavigate } from "react-router-dom";
import useIcons from "../../../hooks/useIcons";

function ConversationFallBack() {
  const icons = useIcons();
  const navigate = useNavigate();

  return (
    <div className="hidden sm:flex flex-1 flex-col justify-center items-start gap-4 h-full p-12 lg:p-24 max-w-2xl bg-transparent">
      <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-400 font-bold text-xs uppercase tracking-wider">
        <span className="text-stone-700 dark:text-stone-300 text-sm">
          {icons.sparkles}
        </span>
        <span>Spread Direct Messaging</span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
        Select a conversation to start interacting with users
      </h1>

      <p className="text-sm lg:text-base text-stone-500 dark:text-stone-400 font-normal leading-relaxed">
        Choose an active thread from your conversations list on the left, or create a new direct message thread to connect with people.
      </p>

      <button
        type="button"
        onClick={() => navigate("new/c")}
        className="spread-btn-primary px-6 py-3 text-xs sm:text-sm font-bold rounded-full shadow-md flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer mt-2"
      >
        <span className="text-sm">{icons.messagePlus}</span>
        <span>Start New Conversation</span>
      </button>

      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800/60 text-stone-500 dark:text-stone-400 text-xs">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm">
          {icons.lock}
        </span>
        <span>Your personal messages are end-to-end encrypted</span>
      </div>
    </div>
  );
}

export default ConversationFallBack;
