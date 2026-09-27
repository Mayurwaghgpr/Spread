import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import ChatApi from "../../services/ChatApi";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import {
  selectConversation,
  setConversationLogData,
} from "../../store/slices/messangerSlice";
import Spinner from "../../components/loaders/Spinner";
import SearchBar from "../../components/inputComponents/SearchBar";
import ProfileImage from "../../components/ProfileImage";
import TimeAgo from "../../components/utilityComp/TimeAgo";
import useIcons from "../../hooks/useIcons";

function MessageLog() {
  const icons = useIcons();
  const { user } = useSelector((state) => state.auth);
  const { conversationLogData, selectedConversation } = useSelector((state) => state.messanger);
  const { getConversations } = ChatApi();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    data: conversationsData,
  } = useInfiniteQuery({
    queryKey: ["convesationsLog"],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      getConversations({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.length !== 0
        ? lastPage[lastPage.length - 1].createdAt
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (conversationsData) {
      dispatch(setConversationLogData(conversationsData?.pages?.flatMap((page) => page)));
    }
  }, [conversationsData, dispatch]);

  // Synchronize selected conversation when arriving from notification links or URL param
  useEffect(() => {
    if (conversationId && conversationLogData && conversationLogData.length > 0) {
      if (!selectedConversation || selectedConversation.id !== conversationId) {
        const matching = conversationLogData.find((c) => c.id === conversationId);
        if (matching) {
          dispatch(selectConversation(matching));
          sessionStorage.setItem("conversationMeta", JSON.stringify(matching));
        }
      }
    }
  }, [conversationId, conversationLogData, selectedConversation, dispatch]);

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    0.1
  );

  const handleSelectConversation = useCallback((conv) => {
    dispatch(selectConversation(conv));
    sessionStorage.setItem("conversationMeta", JSON.stringify(conv));
  }, [dispatch]);

  const filteredLogs = conversationLogData?.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const name = conv.conversationType !== "group"
      ? conv?.members?.find((m) => m.id !== user.id)?.displayName || conv?.members?.find((m) => m.id !== user.id)?.username
      : conv?.groupName;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <aside
      className={`${conversationId ? "hidden sm:flex" : "flex"} flex-col w-full sm:w-80 lg:w-96 border-r  dark:border-stone-800/70 shrink-0 h-full bg-transparent border-inherit`}
    >
      {/* Immersed Header */}
      <header className="sticky top-0 z-20 w-full border-b border-stone-200/70 dark:border-stone-800/70 p-4 space-y-3 bg-transparent backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="p-1.5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/40 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-lg"
              aria-label="Back"
            >
              {icons.arrowL}
            </button>
            <h1 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Messages
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("new/c")}
            className="p-2 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-colors cursor-pointer text-lg"
            title="Start new conversation"
          >
            {icons.addPersonO}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full p-2.5 pl-9 text-xs rounded-xl bg-stone-200/40 dark:bg-stone-800/40 border border-stone-300/50 dark:border-stone-700/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-stone-400/50"
          />
          <div className="absolute left-3 top-3 text-stone-400 pointer-events-none text-xs">
            {icons.searchO}
          </div>
        </div>
      </header>

      {/* Conversations List Immersed */}
      <main className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="w-6 h-6 text-stone-900 dark:text-stone-100" />
          </div>
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((conv, idx, arr) => {
            const isSelected = conv.id === conversationId;
            const isGroup = conv.conversationType === "group";
            const oppositeMember = conv?.members?.find((m) => m.id !== user.id);
            const displayName = isGroup ? conv.groupName : oppositeMember?.displayName || oppositeMember?.username || "Unknown User";
            const image = isGroup ? conv.image : oppositeMember?.userImage;

            return (
              <Link
                key={conv.id}
                to={`c?Id=${conv.id}`}
                replace={conversationId !== null}
                onClick={() => handleSelectConversation(conv)}
                ref={idx === arr.length - 1 ? lastItemRef : null}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${isSelected
                    ? "bg-stone-200/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-semibold"
                    : "hover:bg-stone-200/50 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300"
                  }`}
              >
                <div className="relative shrink-0">
                  <ProfileImage
                    className="w-11 h-11 rounded-full ring-1 ring-stone-300 dark:ring-stone-700"
                    image={image}
                    alt={displayName}
                  />
                  {isGroup && (
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-[10px]">
                      {icons.users}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                      {displayName}
                    </h2>
                    <TimeAgo
                      className="text-[10px] text-stone-400 font-medium shrink-0"
                      date={conv?.updatedAt}
                    />
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate leading-relaxed flex items-center gap-1">
                    {conv?.lastMessage ? (
                      <>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 shrink-0">
                          {icons.lock}
                        </span>
                        <span className="truncate">Encrypted message</span>
                      </>
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-stone-500">
            <div className="w-8 h-8 mb-2 opacity-50 flex items-center justify-center text-2xl">
              {icons.messageSquare}
            </div>
            <p className="text-xs font-semibold">No conversations found</p>
          </div>
        )}
      </main>
    </aside>
  );
}

export default memo(MessageLog);
