import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "react-query";

import ChatApi from "../../services/ChatApi";
import useSocket from "../../hooks/useSocket";
import MessageBubble from "./components/MessageBubble";
import Spinner from "../../component/loaders/Spinner";
import ProfileImage from "../../component/ProfileImage";
import MessageInputSection from "./components/MessageInputSection";

import {
  addMessage,
  popMessage,
  pushMessage,
} from "../../store/slices/messangerSlice";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import TimeAgo from "../../component/utilityComp/TimeAgo";

function ConversationSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages, selectedConversation } = useSelector(
    (state) => state.messanger
  );

  const [typingUsers, setTypingUsers] = useState([]);
  const containerRef = useRef(null);

  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getMessage } = ChatApi();
  const { socket } = useSocket();
  const prevMessagesCount = useRef(0);

  // Memoized conversation data
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

  // Fetch messages
  const {
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
  } = useInfiniteQuery(
    ["messages", conversationId],
    ({ pageParam = new Date().toISOString() }) =>
      getMessage({ conversationId, pageParam }),
    {
      onSuccess: (data) => {
        dispatch(addMessage(data?.pages?.flatMap((page) => page)));
      },

      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined; // Use last item timestamp as cursor
      },
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
    // containerRef
  );

  // Handle typing status
  const handleUserTyping = useCallback(
    ({ conversationId: convId, senderId, image, typing }) => {
      if (convId !== conversationId) return;

      setTypingUsers((prev) => {
        const filteredUsers = prev.filter((user) => user.senderId !== senderId);
        return typing
          ? [...filteredUsers, { senderId, image, typing }]
          : filteredUsers;
      });
    },
    [conversationId]
  );

  // Handle incoming new message
  const handleNewMessage = useCallback(
    (msg) => {
      if (msg.conversationId === conversationId && msg.senderId !== user?.id) {
        dispatch(pushMessage(msg));
        setTypingUsers((prev) =>
          prev.filter((user) => user.senderId !== msg.senderId)
        );
      }
    },
    [dispatch, user?.id, conversationId]
  );

  // Handle sending error
  const handleError = useCallback(() => {
    dispatch(popMessage());
  }, [dispatch]);

  // Socket events
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

  // auto scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
      prevMessagesCount.current = messages.length;
    }
  }, [messages.length]);

  const isUsersTyping = useMemo(
    () =>
      typingUsers.some(
        (typingUser) => typingUser.senderId !== user?.id && typingUser.typing
      ),
    [typingUsers, user?.id]
  );

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
      className={`relative w-full h-full border-inherit bg-inherit ${conversationId ? "sm:visible" : " hidden"} overflow-y-auto`}
    >
      {/* Header */}
      <header className="sticky top-0 border-b border-inherit flex justify-between  bg-light dark:bg-dark z-20 w-full h-fit py-2 px-7">
        <div className="flex items-center gap-3 w-[80%]">
          <ProfileImage
            onClick={() => navigate(`info?Id=${conversationId}`)}
            className="w-10 h-10 min-w-fit cursor-pointer"
            image={conversationData.image}
          />
          <div className="flex flex-col items-start justify-center gap-1 overflow-hidden">
            <h1 className="truncate font-medium text-sm">
              {conversationData.groupName}
            </h1>
            {conversationData.members.length > 0 &&
              conversationData.conversationType !== "private" && (
                <ul className="flex gap-2 text-xs opacity-50">
                  {conversationData.members.some((m) => m.id === user?.id) && (
                    <li>You</li>
                  )}
                  <li>
                    {conversationData.members
                      .map((m) => (m.id !== user?.id ? m.username : null))
                      .join(",")}
                  </li>
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

      {/* Messages */}
      <section
        ref={containerRef}
        className="flex flex-col-reverse w-full  px-5 border-inherit py-5 h-full "
      >
        {isLoading && (
          <Spinner className="w-10 h-10 bg-black p-1 dark:bg-white m-auto" />
        )}
        {/* Empty or loading states */}
        {messages?.length === 0 && !isLoading && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="opacity-50">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        {isFetchingNextPage && hasNextPage && (
          <div className="p-4 w-full">
            <Spinner
              className={"w-10 h-10 bg-black p-1 dark:bg-white m-auto"}
            />
          </div>
        )}
        {/* Typing indicator */}
        <div className="w-full min-h-16 border-inherit">
          {isUsersTyping && (
            <div className="flex gap-1 my-4 border-inherit">
              {conversationData.conversationType !== "private" &&
                typingUsers
                  .filter((u) => u.senderId !== user?.id && u.typing)
                  .map((u) => (
                    <ProfileImage
                      key={u.senderId}
                      className="w-6 h-6"
                      image={u.image}
                    />
                  ))}
              <div className="relative flex items-center justify-center w-fit p-2 text-sm mt-2 bg-light dark:bg-dark border border-inherit rounded-xl rounded-tl-none">
                <span className="typingLoader"></span>
              </div>
            </div>
          )}
        </div>
        {!isLoading &&
          messages?.map((msg, idx, arr) => {
            const msgDate = new Date(msg.createdAt);

            // Since it's descending, the "previous" message is actually the next index
            const prevDate =
              idx < arr.length - 1 ? new Date(arr[idx + 1].createdAt) : null;
            const showDate =
              !prevDate || msgDate.toDateString() !== prevDate.toDateString();

            return (
              <React.Fragment key={msg.id}>
                <MessageBubble
                  ref={idx === arr.length - 1 ? lastItemRef : null}
                  message={msg}
                  userId={user?.id}
                />
                {showDate && (
                  <div className=" flex justify-center text-xs">
                    <TimeAgo
                      className={" opacity-95"}
                      grouped={true}
                      date={msgDate}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </section>

      {/* Input Section */}
      <MessageInputSection
        conversationId={conversationId}
        conversationData={conversationData}
      />

      {/* Outlet for sidebar/info panel */}
      <Outlet
        context={{
          isGroup: selectedConversation?.conversationType === "group",
          conversationData,
        }}
      />
    </div>
  );
}

export default memo(ConversationSection);
