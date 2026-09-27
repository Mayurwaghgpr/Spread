import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
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
  pushMessage,
} from "../../store/slices/messangerSlice";
import { formatDateLabel } from "../../components/utilityComp/TimeAgo";
import { decryptMessage, decryptMessages } from "../../utils/e2ee";
import useIcons from "../../hooks/useIcons";
import EncryptionSecurityModal from "./components/EncryptionSecurityModal";
import EncryptionNoticeBanner from "./components/EncryptionNoticeBanner";

function ConversationSection() {
  const icons = useIcons();
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages, selectedConversation } = useSelector(
    (state) => state.messanger
  );

  const [typingUsers, setTypingUsers] = useState([]);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [floatingDate, setFloatingDate] = useState("");

  const containerRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isInitialScrollDoneRef = useRef(false);

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

  // Sort messages chronologically: oldest at top, newest at bottom
  const chronologicalMessages = useMemo(() => {
    return [...safeMessages].sort(
      (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
    );
  }, [safeMessages]);

  // Group messages by calendar date (WhatsApp / Instagram style)
  const messageGroups = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    for (const msg of chronologicalMessages) {
      const msgDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
      const dateKey = msgDate.toDateString();

      if (!currentGroup || currentGroup.dateKey !== dateKey) {
        currentGroup = {
          dateKey,
          date: msgDate,
          label: formatDateLabel(msg.createdAt),
          messages: [msg],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(msg);
      }
    }
    return groups;
  }, [chronologicalMessages]);

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
      let active = true;
      decryptMessages(flatMsgs, user?.id).then((decryptedMessages) => {
        if (active) dispatch(addMessage(decryptedMessages));
      });
      return () => {
        active = false;
      };
    }
  }, [messagesData, user?.id, dispatch]);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Reset scroll flag when conversation switches
  useEffect(() => {
    isInitialScrollDoneRef.current = false;
    setFloatingDate("");
    setIsScrolling(false);
  }, [conversationId]);

  // Initial scroll to bottom when conversation loads
  useEffect(() => {
    if (!isInitialScrollDoneRef.current && safeMessages.length > 0 && !isLoading) {
      const container = containerRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
          isInitialScrollDoneRef.current = true;
        });
      }
    }
  }, [safeMessages.length, isLoading]);

  // Auto-fetch more messages if screen is not yet filled and more pages exist
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetching &&
      safeMessages.length > 0 &&
      container.scrollHeight <= container.clientHeight + 60
    ) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
      fetchNextPage();
    }
  }, [safeMessages.length, hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  // Seamless scroll anchoring when older messages are loaded from top down
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prevScrollHeightRef.current > 0) {
      const heightDiff = container.scrollHeight - prevScrollHeightRef.current;
      if (heightDiff > 0) {
        container.scrollTop = prevScrollTopRef.current + heightDiff;
      }
      prevScrollHeightRef.current = 0;
      prevScrollTopRef.current = 0;
    }
  }, [safeMessages.length]);

  // Scroll handler: triggers fetching older messages at top & calculates active floating date tag
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Show floating date badge only while actively scrolling (WhatsApp/Telegram style)
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1200);

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Toggle scroll-to-bottom floating button
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
    setShowScrollBottomBtn(!isNearBottom);

    // Fetch older messages when scrolled near top
    if (scrollTop < 120 && hasNextPage && !isFetchingNextPage && !isFetching) {
      prevScrollHeightRef.current = scrollHeight;
      prevScrollTopRef.current = scrollTop;
      fetchNextPage();
    }

    // Determine current top-center date tag based on visible message groups
    const groupElements = container.querySelectorAll("[data-date-label]");
    let currentTag = "";
    const containerRect = container.getBoundingClientRect();
    for (const el of groupElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= containerRect.top + 90) {
        currentTag = el.getAttribute("data-date-label") || "";
      }
    }
    if (currentTag) {
      setFloatingDate(currentTag);
    }
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  // Wheel listener: fetches older messages if user scrolls up while already at top
  const handleWheel = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;

      if (
        e.deltaY < 0 &&
        container.scrollTop <= 15 &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isFetching
      ) {
        prevScrollHeightRef.current = container.scrollHeight;
        prevScrollTopRef.current = container.scrollTop;
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]
  );

  // Set initial floating date tag once groups are available
  useEffect(() => {
    if (messageGroups.length > 0 && !floatingDate) {
      setFloatingDate(messageGroups[messageGroups.length - 1].label);
    }
  }, [messageGroups, floatingDate]);

  const handleUserTyping = useCallback(
    ({ conversationId: convId, senderId }) => {
      if (convId !== conversationId || senderId === user?.id) return;
      setTypingUsers((prev) => {
        const filteredUsers = prev.filter((u) => u.senderId !== senderId);
        return [...filteredUsers, { senderId, timestamp: Date.now() }];
      });
    },
    [conversationId, user?.id]
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
    async (msg) => {
      if (msg?.conversationId === conversationId && msg?.senderId !== user?.id) {
        const decryptedMessage = await decryptMessage(msg, user.id);
        dispatch(pushMessage(decryptedMessage));
        setTypingUsers((prev) =>
          prev.filter((u) => u.senderId !== msg.senderId)
        );

        // Auto-scroll down if user was already near bottom
        const container = containerRef.current;
        if (container) {
          const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 250;
          if (isNearBottom) {
            setTimeout(() => {
              scrollToBottom("smooth");
            }, 60);
          }
        }
      }
    },
    [dispatch, user?.id, conversationId, scrollToBottom]
  );

  // Auto-expire stale typing state after 3.5s of no heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers((prev) => {
        if (!prev.length) return prev;
        const now = Date.now();
        const valid = prev.filter((u) => now - u.timestamp < 3500);
        return valid.length === prev.length ? prev : valid;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLogin || !user?.id || !conversationId || !socket) return;

    const joinRoom = () => {
      socket.emit("joinConversation", conversationId);
    };

    if (socket.connected) {
      joinRoom();
    }
    socket.on("connect", joinRoom);
    socket.on("isTyping", handleUserTyping);
    socket.on("isStopedTyping", handleIsStopedTyping);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("isTyping", handleUserTyping);
      socket.off("isStopedTyping", handleIsStopedTyping);
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveConversation", conversationId);
    };
  }, [
    isLogin,
    user?.id,
    socket,
    conversationId,
    handleUserTyping,
    handleIsStopedTyping,
    handleNewMessage,
  ]);

  const isUsersTyping = useMemo(
    () => typingUsers.some((u) => u.senderId !== user?.id),
    [typingUsers, user?.id]
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-2 text-xl">
          {icons.circleAlert}
        </div>
        <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
          Failed to load conversation
        </p>
        <span className="text-xs text-stone-500">Please try refreshing the page</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full max-h-full border-inherit bg-stone-50/50 dark:bg-stone-950/50 flex flex-col min-w-0 overflow-hidden">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-stone-200/70 dark:border-stone-800/70 px-4 sm:px-6 py-2.5 backdrop-blur-md flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/80">
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
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold truncate">
                {conversationData.conversationType === "private"
                  ? "Active now"
                  : `${conversationData.members?.length || 0} members`}
              </span>
              <span className="text-stone-300 dark:text-stone-700 select-none">•</span>
              <button
                type="button"
                onClick={() => setShowSecurityModal(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer group"
                title="End-to-End Encrypted: Tap to view security details"
              >
                <span className="text-[10px] group-hover:scale-110 transition-transform">
                  {icons.lock}
                </span>
                <span className="truncate group-hover:underline">End-to-End Encrypted</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`info?Id=${conversationId}`)}
          className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/40 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-lg"
          title="Conversation info"
        >
          {icons.infoCircle}
        </button>
      </header>

      {/* Floating Top Center Date Tag (WhatsApp / Instagram style) */}
      {floatingDate && safeMessages.length > 0 && (
        <div
          className={`absolute top-[5rem] inset-x-0 mx-auto z-20 flex justify-center pointer-events-none transition-all duration-300 ${isScrolling
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1"
            }`}
        >
          <span className="text-[11px] font-semibold tracking-wide text-stone-700 dark:text-stone-300 px-3.5 py-1 rounded-full shadow-md border border-stone-200/90 dark:border-stone-800/90 bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur-md pointer-events-auto select-none">
            {floatingDate}
          </span>
        </div>
      )}

      {/* Messages Canvas */}
      <section
        ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className={`relative flex flex-col flex-1 min-h-0 w-full px-4 sm:px-6 py-4 border-inherit ${conversationId ? "visible" : "hidden sm:flex"
          } overflow-y-auto space-y-4`}
      >
        {/* Spacer that pushes few messages to bottom (WhatsApp / Instagram style) */}
        <div className="flex-1 min-h-0 shrink" />

        {/* Loading spinner when scrolling up to load older messages */}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-2 animate-in fade-in duration-150">
            <div className="spread-pill px-3.5 py-1 rounded-full text-[11px] font-medium text-stone-500 dark:text-stone-400 flex items-center gap-2 bg-stone-200/60 dark:bg-stone-800/60 shadow-xs">
              <span className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></span>
              <span>Loading earlier messages...</span>
            </div>
          </div>
        )}

        {/* End-to-End Encryption Banner at the beginning of conversation */}
        {!hasNextPage && safeMessages.length > 0 && !isLoading && (
          <EncryptionNoticeBanner
            onOpenDetails={() => setShowSecurityModal(true)}
          />
        )}

        {/* Empty Conversation State */}
        {safeMessages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full my-auto text-center py-8">
            <div className="w-12 h-12 rounded-full bg-stone-200/60 dark:bg-stone-800/60 flex items-center justify-center mb-3 text-stone-500 text-xl">
              {icons.messageSquare}
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
              No messages yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Send a greeting to start the conversation!
            </p>
            <EncryptionNoticeBanner
              onOpenDetails={() => setShowSecurityModal(true)}
            />
          </div>
        )}

        {/* Render Chronological Message Groups */}
        {!isLoading &&
          messageGroups.map((group) => (
            <div
              key={group.dateKey}
              data-date-label={group.label}
              className="relative w-full space-y-2"
            >
              {/* Centered Date Tag Divider */}
              <div className="flex justify-center my-3 pointer-events-none">
                <span className="text-[11px] font-semibold tracking-wide text-stone-500 dark:text-stone-400 spread-pill px-3 py-0.5 rounded-full select-none shadow-xs border border-stone-200/50 dark:border-stone-800/50 bg-stone-200/50 dark:bg-stone-850/50">
                  {group.label}
                </span>
              </div>

              {/* Messages in Group */}
              <div className="space-y-1.5 w-full">
                {group.messages.map((msg) => (
                  <MessageBubble
                    key={msg?.id}
                    message={msg}
                    userId={user?.id}
                  />
                ))}
              </div>
            </div>
          ))}

        {/* Typing Indicator Bubble */}
        {isUsersTyping && (
          <div className="w-full flex items-center gap-2 py-1.5 animate-in fade-in duration-200">
            <div className="spread-card px-3.5 py-2 rounded-2xl rounded-tl-xs border border-stone-200/80 dark:border-stone-800/80 bg-stone-100/90 dark:bg-stone-900/90 flex items-center gap-2.5 shadow-xs">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
              </span>
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                {conversationData.conversationType === "private"
                  ? `${conversationData.groupName} is typing...`
                  : "Someone is typing..."}
              </span>
            </div>
          </div>
        )}

        {/* Bottom scroll sentinel */}
        <div ref={bottomSentinelRef} className="h-0.5 w-full shrink-0" />
      </section>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottomBtn && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute right-6 bottom-20 z-30 w-9 h-9 rounded-full bg-stone-100/95 dark:bg-stone-900/95 border border-stone-300/80 dark:border-stone-700/80 shadow-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md animate-in fade-in zoom-in-90 duration-150"
          title="Scroll to bottom"
          aria-label="Scroll to latest messages"
        >
          <span className="text-base">{icons.arrowDown}</span>
        </button>
      )}

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

      {/* Security Details Modal */}
      <EncryptionSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </div>
  );
}

export default memo(ConversationSection);
