import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FedInBtn from "../../../components/buttons/FedInBtn";
import CommonInput from "../../../components/inputComponents/CommonInput";
import useIcons from "../../../hooks/useIcons";
import { debounce } from "../../../utils/debounce";
import useSocket from "../../../hooks/useSocket";
import { pushMessage } from "../../../store/slices/messangerSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatApi from "../../../services/ChatApi";
import { useMutation } from "react-query";

function MessageInputSection({ conversationId, conversationData }) {
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const typingTimeoutRef = useRef(null);
  const { sendMessage } = ChatApi();

  const dispatch = useDispatch();
  const icons = useIcons();
  const { socket } = useSocket();

  const sendTypingStatus = useMemo(
    () =>
      debounce((isTyping) => {
        if (!socket || !conversationId || !user?.id) return;

        socket.emit("IamTyping", {
          conversationId,
          senderId: user.id,
          image:
            conversationData.conversationType === "group"
              ? user.userImage
              : null,
          typing: isTyping,
        });
      }, 500),
    [
      socket,
      conversationId,
      user?.id,
      user?.userImage,
      conversationData.conversationType,
    ]
  );
  // Handle input changes with debounced typing status
  const handleInput = useCallback(
    (e) => {
      const value = e.target.value;
      setMessage(value);

      // Only send typing status if there's actual content
      if (value.trim()) {
        sendTypingStatus(true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(false);
      }, 2000);
    },
    [sendTypingStatus]
  );

  const { mutate } = useMutation({
    mutationKey: "sendMessage",
    mutationFn: (messageObj) =>
      sendMessage({
        conversationId: messageObj.conversationId,
        senderId: messageObj.senderId,
        content: messageObj.content,
        replyedTo: messageObj.replyedTo,
        createdAt: messageObj.createdAt,
      }),
    onSettled: () => {
      sendTypingStatus(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });
  // Improved message sending with validation
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
  }, [message, socket, user?.id, conversationId, dispatch]);

  // Clear typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className=" sticky bottom-0 z-20 bg-light dark:bg-dark flex justify-center items-center w-full h-fit border sm:px-5 px-2 pt-2 pb-5 border-inherit">
      <div className="relative flex justify-center items-baseline gap-3 p-2 w-4/5 rounded-lg bg-white border dark:bg-opacity-10 border-inherit">
        <div className="flex justify-start items-center sm:gap-3 w-full border-inherit">
          <div className="flex justify-start items-center gap-2 w-fit border-inherit">
            <FedInBtn className="sm:text-xl rounded-full p-2 border">
              {icons["attachPin"]}
            </FedInBtn>
            <FedInBtn className="sm:text-xl rounded-full p-2 border">
              {icons["smile"]}
            </FedInBtn>
          </div>
          <CommonInput
            className="relative px-2 w-full h-full border-inherit border-0 bg-inherit outline-none peer"
            onChange={handleInput}
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Start Writing..."
          >
            <div className="absolute w-full bottom-0 transition-transform duration-300 border-t border-black dark:border-inherit scale-0 peer-focus:scale-100"></div>
          </CommonInput>
        </div>
        <FedInBtn
          className="flex justify-center items-center text-xl min-w-fit rounded-full p-2"
          action={handleSend}
          disabled={!message.trim()}
        >
          {icons["sendO"]}
        </FedInBtn>
      </div>
    </div>
  );
}

export default MessageInputSection;
