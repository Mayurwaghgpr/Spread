import { useCallback, useEffect, useRef, useState } from "react";
import CommonInput from "../../../components/inputComponents/CommonInput";
import useSocket from "../../../hooks/useSocket";
import { pushMessage, removeMessage } from "../../../store/slices/messangerSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatApi from "../../../services/ChatApi";
import { useMutation } from "@tanstack/react-query";
import { encryptMessage } from "../../../utils/e2ee";
import useIcons from "../../../hooks/useIcons";

function MessageInputSection({
  conversationId,
  conversationData,
  containerRef,
}) {
  const icons = useIcons();
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const lastTypingEmittedRef = useRef(0);
  const { sendMessage, getConversationEncryptionKeys } = ChatApi();

  const dispatch = useDispatch();
  const { socket } = useSocket();

  const sendStopTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    if (isTypingRef.current) {
      isTypingRef.current = false;
      lastTypingEmittedRef.current = 0;
      socket.emit("isStopedTyping", { conversationId });
    }
  }, [socket, conversationId]);

  const handleInput = useCallback(
    (e) => {
      const value = e.target.value;
      setMessage(value);

      if (!socket || !conversationId) return;

      if (value.trim()) {
        const now = Date.now();
        // Emit typing heartbeat immediately on start, and every 1.5s while actively typing
        if (!isTypingRef.current || now - lastTypingEmittedRef.current > 1500) {
          isTypingRef.current = true;
          lastTypingEmittedRef.current = now;
          socket.emit("isTyping", { conversationId });
        }

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          sendStopTyping();
        }, 2200);
      } else {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        sendStopTyping();
      }
    },
    [socket, conversationId, sendStopTyping]
  );

  const { mutate } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (messageObj) => {
      await sendMessage({
        id: messageObj.id,
        conversationId: messageObj.conversationId,
        content: messageObj.encryptedContent,
        replyedTo: messageObj.replyedTo,
      });
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    },
    onSettled: () => {
      sendStopTyping();
    },
    onError: (error, messageObj) => {
      dispatch(removeMessage(messageObj.id));
      console.error("Error sending message:", error);
    },
  });

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !user?.id || !conversationId) return;

    // Immediately cancel typing status when sending
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendStopTyping();

    try {
      const recipientKeys = await getConversationEncryptionKeys(conversationId);
      const encryptedContent = await encryptMessage({
        plaintext: trimmedMessage,
        conversationId,
        senderId: user.id,
        recipientKeys,
      });

      const messageObj = {
        id: uuidv4(),
        // Plaintext exists only in the in-memory UI; encryptedContent is the
        // sole payload sent to the API or persisted by the server.
        content: trimmedMessage,
        encryptedContent,
        senderId: user.id,
        conversationId,
        createdAt: new Date().toISOString(),
      };

      dispatch(pushMessage(messageObj));
      mutate(messageObj);
      setMessage("");
    } catch (error) {
      console.error("Unable to encrypt message:", error);
    }
  }, [message, user?.id, conversationId, dispatch, mutate, getConversationEncryptionKeys, sendStopTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendStopTyping();
    };
  }, [sendStopTyping]);

  return (
    <div className="sticky bottom-0 z-20 p-2 sm:p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 backdrop-blur-md flex flex-col justify-center items-center w-full">
      <div className="flex items-center gap-2 p-1.5 w-full max-w-3xl spread-card rounded-full border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-xl focus-within:ring-2 focus-within:ring-stone-400/50 transition-all">
        <div className="flex items-center gap-1 pl-2 text-stone-500 dark:text-stone-400">
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-base"
            aria-label="Attach file"
          >
            {icons.paperclip}
          </button>
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-base"
            aria-label="Add emoji"
          >
            {icons.smile}
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
          className={`p-2.5 rounded-full spread-btn-primary flex items-center justify-center transition-transform text-sm ${
            !message.trim()
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105 cursor-pointer shadow-md"
          }`}
          aria-label="Send message"
        >
          {icons.sendFi}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1.5 text-[10px] text-stone-400 dark:text-stone-500 font-medium select-none">
        <span className="text-[10px]">{icons.lock}</span>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
}

export default MessageInputSection;
