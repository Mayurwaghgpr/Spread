import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Sparkles } from "lucide-react";

function ConversationFallBack() {
  const navigate = useNavigate();

  return (
    <div className="hidden sm:flex flex-1 flex-col justify-center items-start gap-4 h-full p-12 lg:p-24 max-w-2xl bg-transparent">
      <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-400 font-bold text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300" />
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
        <MessageSquarePlus className="w-4 h-4 text-stone-900 dark:text-stone-100" />
        <span>Start New Conversation</span>
      </button>
    </div>
  );
}

export default ConversationFallBack;
