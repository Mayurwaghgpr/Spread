import { BsCheck2All } from "react-icons/bs";
import TimeAgo from "../../../components/utilityComp/TimeAgo";
import { forwardRef } from "react";

const MessageBubble = forwardRef(({ message, userId, readReceipt }, ref) => {
  const isSender = message.senderId === userId;
  const isRead = readReceipt?.includes(message.id);

  return (
    <div
      ref={ref}
      className={`border-inherit max-w-[70%] sm:max-w-[50%] w-fit my-3 
        z-0 ${isSender ? "ml-auto text-end" : "mr-auto"}
      `}
    >
      <div
        className={`relative flex flex-col gap-1 text-xs sm:text-sm break-words w-fit border border-inherit rounded-2xl px-4 py-2.5 ${
          isSender
            ? "ml-auto items-start text-start bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-br-none shadow-sm"
            : "mr-auto items-end bg-[#f5f1ec] dark:bg-[#121212] text-stone-900 dark:text-stone-100 rounded-bl-none shadow-sm"
        }`}
        key={message?.id}
      >
        <p className="w-full font-normal leading-relaxed">{message.content}</p>

        <div className="flex items-center justify-end gap-1.5 self-end mt-0.5 opacity-80">
          <TimeAgo
            className="text-[10px] font-medium"
            date={message.createdAt}
          />
          {isSender && (
            <BsCheck2All
              className={`text-sm ${isRead ? "text-emerald-500" : "text-stone-400"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;
