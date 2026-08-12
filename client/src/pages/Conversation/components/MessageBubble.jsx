import React, { forwardRef, memo } from "react";
import TimeAgo from "../../../components/utilityComp/TimeAgo";
import { CheckCheck } from "lucide-react";

const MessageBubble = forwardRef(({ message, userId, readReceipt }, ref) => {
  if (!message) return null;

  const isSender = message?.senderId === userId;
  const isRead = readReceipt?.includes(message?.id);

  return (
    <div
      ref={ref}
      className={`w-full flex my-1.5 ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative flex flex-col gap-1 max-w-[82%] sm:max-w-[60%] text-xs sm:text-sm break-words px-4 py-2.5 shadow-sm transition-all animate-in fade-in duration-150 ${
          isSender
            ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-2xl rounded-tr-xs"
            : "spread-card bg-stone-200/70 dark:bg-stone-800/70 text-stone-900 dark:text-stone-100 border border-stone-300/50 dark:border-stone-700/50 rounded-2xl rounded-tl-xs"
        }`}
      >
        <p className="w-full font-normal leading-relaxed whitespace-pre-wrap">
          {message?.content || ""}
        </p>

        <div
          className={`flex items-center justify-end gap-1 self-end text-[10px] opacity-75 mt-0.5 ${
            isSender ? "text-stone-300 dark:text-stone-600" : "text-stone-500 dark:text-stone-400"
          }`}
        >
          {message?.createdAt && <TimeAgo date={message.createdAt} />}
          {isSender && (
            <CheckCheck
              className={`w-3.5 h-3.5 ${isRead ? "text-stone-100 dark:text-stone-900 font-bold" : "opacity-60"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

export default memo(MessageBubble);
