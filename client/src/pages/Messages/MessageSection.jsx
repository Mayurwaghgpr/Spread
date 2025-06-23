import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatApi from "../../services/ChatApi";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
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
} from "../../store/slices/messangerSlice";

import useIcons from "../../hooks/useIcons";
import { IoAttach } from "react-icons/io5";
import CommonInput from "../../component/inputComponents/CommonInput";
import { debounce } from "../../utils/debounce";
import FedInBtn from "../../component/buttons/FedInBtn";

function MessageSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages, selectedConversation } = useSelector(
    (state) => state.messanger
  );
  const [typingUsers, setTypingUsers] = useState([]);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevMessagesCount = useRef(0);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getMessage } = ChatApi();
  const { socket } = useSocket();

  const icons = useIcons();

  // Memoized conversation data with better fallback handling
  const conversationData = useMemo(() => {
    if (!selectedConversation) {
      return { id: null, groupName: "Unknown", image: "", members: [] };
    }

    if (selectedConversation.conversationType === "private") {
      const oppositeMember = selectedConversation.members?.find(
        (m) => m.id !== user?.id
      );
      return {
        id: selectedConversation.id,
        image: oppositeMember?.userImage || "",
        groupName: oppositeMember?.displayName || "Unknown",
        members: selectedConversation.members || [],
        conversationType: "private",
      };
    }

    return {
      ...selectedConversation,
      groupName: selectedConversation.groupName || "Unknown",
      image: selectedConversation.image || "",
      members: selectedConversation.members || [],
    };
  }, [selectedConversation, user?.id]);

  // Query for fetching messages with better error handling
  const { isLoading, error } = useQuery(["messages", conversationId], {
    queryFn: () => getMessage({ conversationId }),
    onSuccess: (data) => {
      dispatch(addMessage(data));
    },
    enabled: !!conversationId && !!user?.id,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Optimized typing handler with proper cleanup
  const handleUserTyping = useCallback(
    ({ conversationId: convId, senderId, image, typing }) => {
      if (convId !== conversationId) return;

      setTypingUsers((prev) => {
        const filteredUsers = prev.filter((user) => user.senderId !== senderId);
        if (typing) {
          return [...filteredUsers, { senderId, image, typing }];
        }
        return filteredUsers;
      });
    },
    [conversationId]
  );

  // Uncommented and improved message handler
  const handleNewMessage = useCallback(
    (msg) => {
      if (msg.conversationId === conversationId && msg.senderId !== user?.id) {
        dispatch(pushMessage(msg));
        // Remove typing indicator for this user
        setTypingUsers((prev) =>
          prev.filter((user) => user.senderId !== msg.senderId)
        );
      }
    },
    [dispatch, user?.id, conversationId]
  );

  const handleError = useCallback(() => {
    dispatch(popMessage());
  }, [dispatch]);

  // Socket event management with proper cleanup
  useEffect(() => {
    if (!isLogin || !user?.id || !conversationId || !socket) return;

    socket.emit("joinConversation", conversationId);
    socket.on("userIsTyping", handleUserTyping);
    socket.on("newMessage", handleNewMessage);
    socket.on("ErrorSendMessage", handleError);

    return () => {
      socket.off("userIsTyping", handleUserTyping);
      socket.off("newMessage", handleNewMessage);
      socket.off("ErrorSendMessage", handleError);
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

  // Improved message sending with validation
  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !user?.id || !conversationId || !socket) return;

    const messageObj = {
      id: uuidv4(),
      content: trimmedMessage,
      senderId: user.id,
      conversationId,
      timestamp: new Date().toISOString(),
    };

    dispatch(pushMessage(messageObj));
    socket.emit("sendMessage", messageObj);
    setMessage("");
  }, [message, socket, user?.id, conversationId, dispatch]);

  // Optimized typing status with proper dependencies
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

  // Fixed input handler - removed duplicate setMessage call
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

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll effect with better performance
  useEffect(() => {
    if (prevMessagesCount.current !== messages.length && containerRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
      prevMessagesCount.current = messages.length;
    }
  }, [messages.length]);

  // Optimized typing users check
  const isUsersTyping = useMemo(
    () => typingUsers.some((user) => user.senderId !== user?.id && user.typing),
    [typingUsers, user?.id]
  );

  // Show error state if query fails
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          Failed to load messages. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative ${
        conversationId ? "sm:visible" : "hidden"
      } grid grid-cols-10 grid-rows-12 w-full h-screen border-inherit bg-inherit`}
    >
      {/* Header */}
      <header className="flex justify-between col-span-full bg-[#fff9f3] dark:bg-black z-20 w-full h-fit py-2 px-7">
        <div className="flex justify-start items-center gap-3 w-[80%]">
          <ProfileImage
            onClick={() => navigate(`info?Id=${conversationId}`)}
            className="max-w-10 max-h-10 w-full h-full min-w-fit cursor-pointer"
            image={conversationData.image}
          />
          <div className="flex flex-col items-start justify-center gap-1 overflow-hidden">
            <h1 className="truncate font-semibold">
              {conversationData.groupName}
            </h1>
            {conversationData.members.length > 0 && (
              <ul className="flex justify-start items-center gap-2 text-xs opacity-50">
                {conversationData.members.some((m) => m.id === user?.id) && (
                  <li>You</li>
                )}
                {
                  <li>
                    {conversationData.members
                      .map((member) =>
                        member?.id !== user?.id ? member.username : null
                      )
                      .join(",")}
                  </li>
                }
                {conversationData.conversationType === "group" && (
                  <li className="text-gray-400">
                    ({conversationData.members.length} members)
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="sm:flex flex-col justify-start w-full h-full col-span-full row-start-2 row-span-full scroll-smooth p-5 border-inherit no-scroll overflow-y-auto"
      >
        {/* No Conversation Selected */}
        {!conversationId && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-gray-500">
              Select a conversation to start chatting.
            </p>
          </div>
        )}
        {/* Messages List */}
        {!isLoading &&
          messages?.map((msg) => (
            <MessageBubble key={msg.id} message={msg} userId={user?.id} />
          ))}

        {/* Typing Indicator */}
        <div className="w-full min-h-16">
          {isUsersTyping && (
            <div className="flex gap-1 my-4">
              {typingUsers
                .filter((usr) => usr.senderId !== user?.id && usr.typing)
                .map((usr) => (
                  <ProfileImage
                    key={usr.senderId}
                    className="w-6 h-6"
                    image={usr.image}
                  />
                ))}
              <div className="relative flex items-center justify-center py-2 px-2 text-sm mt-2 ml-2 bg-[#fffefe] dark:shadow-white rounded-xl rounded-tl-none">
                <div className="absolute left-[-5px] top-0 -z-[1] w-0 h-0 border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-inherit"></div>
                <span className="typingLoader"></span>
              </div>
            </div>
          )}
        </div>
        {messages?.length === 0 && !isLoading && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="opacity-50 ">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        {/* Loading Spinner */}
        {isLoading && (
          <Spinner className="w-10 h-10 bg-black p-1 dark:bg-white m-auto" />
        )}
      </div>

      {/* Input Section */}
      <div className="flex justify-center items-center col-span-full w-full h-fit border-t sm:px-5 px-2 pt-2 pb-5 border-inherit bg-inherit">
        <div className="relative flex justify-center items-baseline gap-3 p-2 w-4/5 rounded-lg bg-white border dark:bg-opacity-10 border-inherit">
          <div className="flex justify-start items-center sm:gap-3 w-full border-inherit">
            <div className="flex justify-start items-center gap-2 w-fit border-inherit">
              <FedInBtn className="sm:text-xl rounded-full p-2 border">
                <IoAttach />
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

      <Outlet
        context={{
          isGroup: selectedConversation?.conversationType === "group",
          conversationData,
        }}
      />
    </div>
  );
}

export default memo(MessageSection);
