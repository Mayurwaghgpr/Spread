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
import { useInfiniteQuery } from "@tanstack/react-query";

import ChatApi from "../../services/ChatApi";
import useSocket from "../../hooks/useSocket";
import MessageBubble from "./components/MessageBubble";
import ProfileImage from "../../components/ProfileImage";
import MessageInputSection from "./components/MessageInputSection";

import {
  addMessage,
  popMessage,
  pushMessage,
} from "../../store/slices/messangerSlice";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import TimeAgo from "../../components/utilityComp/TimeAgo";
import { Info, MessageSquare, AlertCircle } from "lucide-react";
import Spinner from "../../components/loaders/Spinner";

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

  const safeMessages = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages]
  );

  const conversationData = useMemo(() => {
    if (!selectedConversation) {
      return { id: null, groupName: "Conversation", image: "", members: [] };
    }

    if (selectedConversation.conversationType === "private") {
      const oppositeMember = selectedConversation.members?.find(
        (m) => m.id !== user?.id
      );
      return {
        id: selectedConversation.id,
        image: oppositeMember?.userImage || "",
        groupName: oppositeMember?.displayName || oppositeMember?.username || "Direct Message",
        members: selectedConversation.members || [],
        conversationType: "private",
      };
    }

    return {
      ...selectedConversation,
      groupName: selectedConversation.groupName || "Group Chat",
      image: selectedConversation.image || "",
      members: selectedConversation.members || [],
    };
  }, [selectedConversation, user?.id]);

  const {
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    data: messagesData,
  } = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      getMessage({ conversationId, pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length !== 0
        ? lastPage[lastPage.length - 1].createdAt
        : undefined;
    },
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (messagesData?.pages) {
      const flatMsgs = messagesData.pages.flatMap((page) => (Array.isArray(page) ? page : []));
      dispatch(addMessage(flatMsgs));
    }
  }, [messagesData, dispatch]);

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    0.1
  );

  const handleUserTyping = useCallback(
    ({ conversationId: convId, senderId, image }) => {
      if (convId !== conversationId) return;
      setTypingUsers((prev) => {
        const filteredUsers = prev.filter((u) => u.senderId !== senderId);
        return [...filteredUsers, { senderId, image }];
      });
    },
    [conversationId]
  );

  const handleIsStopedTyping = useCallback(
    ({ conversationId: convId, senderId }) => {
      if (convId !== conversationId) return;
      setTypingUsers((prev) =>
        prev.filter((u) => u.senderId !== senderId)
      );
    },
    [conversationId]
  );

  const handleNewMessage = useCallback(
    (msg) => {
      if (msg?.conversationId === conversationId && msg?.senderId !== user?.id) {
        dispatch(pushMessage(msg));
        setTypingUsers((prev) =>
          prev.filter((u) => u.senderId !== msg.senderId)
        );
      }
    },
    [dispatch, user?.id, conversationId]
  );

  const handleError = useCallback(() => {
    dispatch(popMessage());
  }, [dispatch]);

  useEffect(() => {
    if (!isLogin || !user?.id || !conversationId || !socket) return;

    socket.emit("joinConversation", conversationId);
    socket.on("isTyping", handleUserTyping);
    socket.on("isStopedTyping", handleIsStopedTyping);
    socket.on("newMessage", handleNewMessage);
    socket.on("ErrorSendMessage", handleError);

    return () => {
      socket.off("isTyping", handleUserTyping);
      socket.off("isStopedTyping", handleIsStopedTyping);
      socket.off("newMessage", handleNewMessage);
      socket.off("ErrorSendMessage", handleError);
    };
  }, [
    isLogin,
    user?.id,
    socket,
    conversationId,
    handleUserTyping,
    handleIsStopedTyping,
    handleNewMessage,
    handleError,
  ]);

  const isUsersTyping = useMemo(
    () => typingUsers.some((u) => u.senderId !== user?.id),
    [typingUsers, user?.id]
  );

  const shouldObserve = hasNextPage && !isFetchingNextPage;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-2">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
          Failed to load conversation
        </p>
        <span className="text-xs text-stone-500">Please try refreshing the page</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full max-h-full border-inherit bg-stone-50/50 dark:bg-stone-950/50 flex flex-col min-w-0">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-stone-200/70 dark:border-stone-800/70 px-4 sm:px-6 py-3 backdrop-blur-md flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-3 min-w-0">
          <ProfileImage
            onClick={() => navigate(`info?Id=${conversationId}`)}
            className="w-10 h-10 rounded-full ring-1 ring-stone-300 dark:ring-stone-700 cursor-pointer shrink-0"
            image={conversationData.image}
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
              {conversationData.groupName}
            </h1>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold truncate">
              {conversationData.conversationType === "private"
                ? "Active now"
                : `${conversationData.members?.length || 0} members`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`info?Id=${conversationId}`)}
          className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/40 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
          title="Conversation info"
        >
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Messages Canvas */}
      <section
        ref={containerRef}
        className={`relative flex flex-col-reverse flex-1 w-full px-4 sm:px-6 py-6 border-inherit ${
          conversationId ? "visible" : "hidden sm:flex"
        } overflow-y-auto [overflow-anchor:none] space-y-reverse space-y-2`}
      >
        {/* Empty Conversation State */}
        {safeMessages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full my-auto text-center py-12">
            <div className="w-12 h-12 rounded-full bg-stone-200/60 dark:bg-stone-800/60 flex items-center justify-center mb-3 text-stone-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
              No messages yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Send a greeting to start the conversation!
            </p>
          </div>
        )}

        {/* Typing Indicator Bubble */}
        {isUsersTyping && (
          <div className="w-full flex items-center gap-2 py-2">
            <div className="spread-card px-3.5 py-2 rounded-2xl rounded-tl-xs border border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
              <Spinner className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Typing response...</span>
            </div>
          </div>
        )}

        {/* Render Messages */}
        {!isLoading &&
          safeMessages.map((msg, idx, arr) => {
            const msgDate = msg?.createdAt ? new Date(msg.createdAt) : new Date();
            const prevDate =
              idx < arr.length - 1 && arr[idx + 1]?.createdAt
                ? new Date(arr[idx + 1].createdAt)
                : null;
            const showDate =
              !prevDate || msgDate.toDateString() !== prevDate.toDateString();

            return (
              <React.Fragment key={msg?.id || `msg-${idx}`}>
                <MessageBubble
                  ref={
                    shouldObserve && idx === arr.length - 1 ? lastItemRef : null
                  }
                  message={msg}
                  userId={user?.id}
                />
                {showDate && (
                  <div className="flex justify-center text-center my-3">
                    <TimeAgo
                      className="text-[11px] font-bold text-stone-500 dark:text-stone-400 spread-pill px-3 py-1 rounded-full"
                      grouped={true}
                      date={msgDate}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </section>

      {/* Message Input Bar */}
      <MessageInputSection
        conversationId={conversationId}
        conversationData={conversationData}
        containerRef={containerRef}
      />

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
