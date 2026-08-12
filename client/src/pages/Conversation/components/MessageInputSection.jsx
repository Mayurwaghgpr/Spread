import { useCallback, useEffect, useRef, useState } from "react";
import CommonInput from "../../../components/inputComponents/CommonInput";
import { debounce } from "../../../utils/functions/debounce";
import useSocket from "../../../hooks/useSocket";
import { pushMessage } from "../../../store/slices/messangerSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatApi from "../../../services/ChatApi";
import { useMutation } from "@tanstack/react-query";
import { Paperclip, Smile, Send } from "lucide-react";

function MessageInputSection({
  conversationId,
  conversationData,
  containerRef,
}) {
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const typingTimeoutRef = useRef(null);
  const { sendMessage } = ChatApi();

  const dispatch = useDispatch();
  const { socket } = useSocket();

  const sendTypingStatus = debounce(() => {
    if (!socket || !conversationId || !user?.id) return;

    socket.emit("isTyping", {
      conversationId,
      senderId: user.id,
      image:
        conversationData.conversationType === "group" ? user.userImage : null,
    });
  }, 400);

  const sendStopTyping = useCallback(() => {
    if (!socket || !conversationId || !user?.id) return;
    socket.emit("isStopedTyping", {
      conversationId,
      senderId: user.id,
    });
  }, [socket, conversationId, user?.id]);

  const handleInput = useCallback(
    (e) => {
      const value = e.target.value;
      setMessage(value);

      if (value.trim()) {
        sendTypingStatus();
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping();
      }, 1800);
    },
    [sendTypingStatus, sendStopTyping]
  );

  const { mutate } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: (messageObj) => {
      sendMessage({
        conversationId: messageObj.conversationId,
        senderId: messageObj.senderId,
        content: messageObj.content,
        replyedTo: messageObj.replyedTo,
        createdAt: messageObj.createdAt,
      });
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    },
    onSettled: () => {
      sendStopTyping();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !user?.id || !conversationId || !socket) return;

    const messageObj = {
      id: uuidv4(),
      content: trimmedMessage,
      senderId: user.id,
      conversationId,
      createdAt: new Date().toISOString(),
    };

    dispatch(pushMessage(messageObj));
    mutate(messageObj);
    setMessage("");
  }, [message, socket, user?.id, conversationId, dispatch, mutate]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="sticky bottom-0 z-20 p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 backdrop-blur-md flex justify-center items-center w-full">
      <div className="flex items-center gap-2 p-1.5 w-full max-w-3xl spread-card rounded-full border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-xl focus-within:ring-2 focus-within:ring-stone-400/50 transition-all">
        <div className="flex items-center gap-1 pl-2 text-stone-500 dark:text-stone-400">
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            aria-label="Add emoji"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        <CommonInput
          className="flex-1 px-2 py-1 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 border-none outline-none"
          onChange={handleInput}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a message..."
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2.5 rounded-full spread-btn-primary flex items-center justify-center transition-transform ${
            !message.trim()
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105 cursor-pointer shadow-md"
          }`}
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default MessageInputSection;
