import { memo, useCallback, useRef, useState } from "react";
import { PopupBox } from "../../components/utilityComp/PopupBox";
import SearchBar from "../../components/inputComponents/SearchBar";
import PeoplesList from "../../components/PeoplesList";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import usePublicApis from "../../services/publicApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import { useNavigate } from "react-router-dom";
import LoaderScreen from "../../components/loaders/loaderScreen";
import GroupCreation from "./components/GroupCreation";
import SelectedGroupMemberList from "./components/SelectedGroupMemberList";
import Spinner from "../../components/loaders/Spinner";
import usePrivateChatMutation from "../../hooks/usePrivateChatMutation";
import { Users, ArrowLeft, Search, Sparkles } from "lucide-react";

const NewConversation = () => {
  const [search, setSearch] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [next, setNext] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [selectedMembers, setSelectedMembers] = useState({
    [user.id]: { memberId: user.id, memberType: "admin" },
  });

  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { fetchPeopel } = usePublicApis();
  const { privateChatMutaion, isPrivateChatLoading } = usePrivateChatMutation();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["UsersList", search],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      fetchPeopel({ pageParam, username: search }),
    getNextPageParam: (lastPage) =>
      lastPage.length ? lastPage[lastPage.length - 1].createdAt : undefined,
    refetchOnWindowFocus: false,
  });

  const users = data?.pages?.flatMap((page) => page) || [];
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    0.1
  );

  const handleGroupConfig = useCallback((id) => {
    setSelectedMembers((prev) => {
      const updated = { ...prev };
      if (updated[id]) delete updated[id];
      else updated[id] = { memberId: id };
      return updated;
    });
  }, []);

  const handleCancelGroup = useCallback(() => {
    setIsCreatingGroup(false);
    setNext(false);
    setSelectedMembers({
      [user.id]: { memberId: user.id, memberType: "admin" },
    });
  }, [user.id]);

  const canProceedToNext = Object.entries(selectedMembers).length > 1;

  if (isPrivateChatLoading) {
    return <LoaderScreen message="Initializing conversation..." />;
  }

  return (
    <PopupBox
      className="relative flex flex-col justify-start items-center max-w-md w-full h-[80vh] spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-150"
      action={() => navigate(-1)}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 w-full p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-800/30 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          {isCreatingGroup ? (
            <button
              type="button"
              onClick={() => (!next ? handleCancelGroup() : setNext(false))}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="w-12" />
          )}

          <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-1.5">
            <span>{isCreatingGroup ? "Create Group" : "New Message"}</span>
            <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          </h2>

          {isCreatingGroup && canProceedToNext && !next ? (
            <button
              type="button"
              onClick={() => setNext(true)}
              className="spread-btn-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer"
            >
              Next
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Search Input & Group Selection controls */}
        <div className="space-y-2">
          <div className="relative w-full">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or handle..."
              className="w-full p-2.5 pl-9 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-stone-400/50"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400 pointer-events-none" />
          </div>

          {isCreatingGroup && canProceedToNext && (
            <SelectedGroupMemberList
              handleGroupConfig={handleGroupConfig}
              selectedMembers={selectedMembers}
              users={users}
            />
          )}

          {(!isCreatingGroup || !canProceedToNext) && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingGroup(true)}
                className="spread-pill text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer text-stone-800 dark:text-stone-200"
              >
                <Users className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>New Group Chat</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* User Selection List */}
      {!next ? (
        <div
          ref={containerRef}
          className="flex-1 w-full overflow-y-auto p-3 sm:p-4 space-y-1"
        >
          {users?.map((Usr, idx, arr) => (
            <PeoplesList
              ref={idx === arr.length - 1 ? lastItemRef : null}
              key={Usr.id}
              person={Usr}
              popover={false}
              action={() =>
                isCreatingGroup
                  ? handleGroupConfig(Usr.id)
                  : privateChatMutaion(Usr?.id)
              }
            >
              {isCreatingGroup && (
                <input
                  type="checkbox"
                  onChange={() => handleGroupConfig(Usr.id)}
                  checked={!!selectedMembers[Usr.id]}
                  name="userId"
                  id={Usr.id}
                  className="w-4 h-4 accent-stone-800 dark:accent-stone-200 rounded cursor-pointer"
                />
              )}
            </PeoplesList>
          ))}

          {isLoading && (
            <div className="flex justify-center items-center py-6">
              <Spinner className="w-5 h-5 text-stone-900 dark:text-stone-100" />
            </div>
          )}

          {!isLoading && users?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-stone-500">
              <Users className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs font-semibold">No users found for "{search}"</p>
            </div>
          )}
        </div>
      ) : (
        <GroupCreation
          setNext={setNext}
          selectedMembers={selectedMembers}
          handleGroupConfig={handleGroupConfig}
          users={users}
        />
      )}
    </PopupBox>
  );
};

export default memo(NewConversation);
