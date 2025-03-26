import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsCameraVideo } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import ChatApi from "../../Apis/ChatApi";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import useSocket from "../../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import MessageBubble from "./components/MessageBubble";
import Spinner from "../../component/loaders/Spinner";
import ProfileImage from "../../component/ProfileImage";
import {
  addMessage,
  popMessage,
  pushMessage,
} from "../../redux/slices/messangerSlice";

function MessageSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages, selectedConversation } = useSelector(
    (state) => state.messanger
  );
  const [typingUsers, setTypingUsers] = useState([]);
  const [message, setMessage] = useState("");
  const { getMessage } = ChatApi();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const { socket } = useSocket();
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevMessagesCount = useRef(0);

  const { isLoading } = useQuery(["messages", conversationId], {
    queryFn: () => getMessage({ conversationId }),
    onSuccess: (data) => {
      dispatch(addMessage(data));
    },
  });

  const handleUserTyping = useCallback(({ senderId, image, typing }) => {
    setTypingUsers((prev) => [
      ...prev.filter((evn) => evn.senderId !== senderId),
      { senderId, image, typing },
    ]);
  }, []);

  const handleNewMessage = useCallback(
    (msg) => {
      if (msg.senderId !== user?.id) {
        dispatch(pushMessage(msg));
        setTypingUsers((prev) =>
          prev.filter((evn) => evn.senderId !== msg.senderId)
        );
      }
    },
    [dispatch, user?.id]
  );

  const handleError = useCallback(() => dispatch(popMessage()), [dispatch]);

  useEffect(() => {
    if (isLogin && user?.id && conversationId) {
      socket?.emit("joinConversation", conversationId);

      socket?.on("userIsTyping", handleUserTyping);
      socket?.on("newMessage", handleNewMessage);
      socket?.on("ErrorSendMessage", handleError);
    }

    return () => {
      socket?.off("userIsTyping", handleUserTyping);
      socket?.off("newMessage", handleNewMessage);
      socket?.off("ErrorSendMessage", handleError);
    };
  }, [
    isLogin,
    user?.id,
    socket,
    conversationId,
    handleUserTyping,
    handleNewMessage,
    handleError,
  ]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    const messageObj = {
      id: uuidv4(),
      content: message,
      senderId: user?.id,
      conversationId,
      createdAt: new Date().toISOString(),
    };
    dispatch(pushMessage(messageObj));
    socket?.emit("sendMessage", messageObj);
    setMessage("");
  }, [message, socket, user?.id, conversationId, dispatch]);

  const handleInput = useCallback(
    (e) => {
      setMessage(e.target.value);
      socket?.emit("IamTyping", {
        conversationId,
        senderId: user?.id,
        image: user?.userImage,
        typing: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("IamTyping", {
          conversationId,
          senderId: user?.id,
          typing: false,
        });
      }, 1500);
    },
    [conversationId, socket, user?.id, user?.userImage]
  );

  useEffect(() => {
    if (prevMessagesCount.current !== messages.length) {
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      prevMessagesCount.current = messages.length;
    }
  }, [messages.length]);

  const conversationData = useMemo(() => {
    if (selectedConversation?.conversationType === "private") {
      const appositeMember = selectedConversation?.members?.find(
        (member) => member.id !== user?.id
      );
      return {
        image: appositeMember?.userImage || "",
        groupName: appositeMember?.displayName || "Unknown",
      };
    }
    return selectedConversation || { groupName: "Unknown", image: "" };
  }, [selectedConversation, user?.id]);

  const isUsersTyping = useMemo(
    () => typingUsers.some((env) => env.senderId !== user?.id && env.typing),
    [typingUsers, user?.id]
  );

  return (
    <div
      ref={containerRef}
      className={`${conversationId ? "sm:visible" : "hidden"} relative w-full sm:flex flex-col justify-between border-inherit overflow-y-auto`}
    >
      <div className="sticky top-0 bg-[#fff9f3] dark:bg-black z-20 flex justify-between w-full py-2 px-7 border-b border-inherit shadow-md">
        <div className="flex justify-start items-center gap-3 w-[80%]">
          <ProfileImage
            className="max-w-10 max-h-10 w-full h-full min-w-fit"
            image={conversationData?.image}
          />
          <div className="flex flex-col items-start justify-center gap-1 overflow-hidden overflow-ellipsis text-nowrap">
            <h1>{conversationData?.groupName}</h1>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-2xl">
          <button>
            <BsCameraVideo />
          </button>
          <button>
            <IoCallOutline />
          </button>
        </div>
      </div>

      <div className="sm:flex flex-col justify-end h-full scroll-smooth no-scroll px-3 pt-5 pb-20 drop-shadow-xl">
        {messages?.map((message) => (
          <MessageBubble key={message.id} message={message} userId={user.id} />
        ))}
        {isUsersTyping && (
          <div className="flex gap-1 my-4">
            {typingUsers.map(
              (usr, idx) =>
                usr.senderId !== user.id && (
                  <ProfileImage
                    key={usr.senderId}
                    className="w-6 h-6"
                    image={usr?.image}
                  />
                )
            )}
            <div className="flex items-center justify-center py-2 px-2 text-sm bg-[#fffefe] dark:shadow-white rounded-xl rounded-tl-none">
              <span className="typingLoader"></span>
            </div>
          </div>
        )}
        {isLoading && (
          <Spinner className="w-10 h-10 bg-black p-1 dark:bg-white" />
        )}
      </div>

      <div className="sticky sm:bottom-3 bottom-0 mx-auto flex justify-center items-center gap-3 lg:w-1/2 w-full py-3 z-10 border-inherit">
        <input
          onChange={handleInput}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          value={message}
          className="w-full p-2 px-4 outline-none bg-inherit border rounded-full border-inherit"
          placeholder="Start typing..."
        />
        <button className="p-4 " onClick={handleSend}>
          <AiOutlineSend size={25} />
        </button>
      </div>
    </div>
  );
}

export default memo(MessageSection);
