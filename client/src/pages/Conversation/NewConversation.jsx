import { memo, useCallback, useRef, useState } from "react";
import { PopupBox } from "../../component/utilityComp/PopupBox";
import SearchBar from "../../component/inputComponents/SearchBar";
import PeoplesList from "../../component/PeoplesList";
import { useSelector } from "react-redux";
import Ibutton from "../../component/buttons/Ibutton";
import { useInfiniteQuery } from "react-query";
import usePublicApis from "../../services/publicApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import { useNavigate } from "react-router-dom";
import LoaderScreen from "../../component/loaders/loaderScreen";
import GroupCreation from "./components/GroupCreation";
import SelectedGroupMemberList from "./components/SelectedGroupMemberList";
import Spinner from "../../component/loaders/Spinner";
import usePrivateChatMutation from "../../hooks/usePrivateChatMutation";
import useIcons from "../../hooks/useIcons";

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
  const icons = useIcons();
  const { fetchPeopel } = usePublicApis();
  const { privateChatMutaion, isPrivateChatLoading } = usePrivateChatMutation();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["UsersList", search],
    ({ pageParam = new Date().toISOString() }) =>
      fetchPeopel({ pageParam, username: search }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.length ? lastPage[lastPage.length - 1].createdAt : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const users = data?.pages?.flatMap((page) => page) || [];
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  // Toggle user selection for group creation
  const handleGroupConfig = useCallback((id) => {
    setSelectedMembers((prev) => {
      const updated = { ...prev };
      if (updated[id]) delete updated[id];
      else updated[id] = { memberId: id };
      return updated;
    });
  }, []);

  /** Cancel group creation process */
  const handleCancelGroup = useCallback(() => {
    setIsNextStep(false);
    setSelectedMembers({
      [user.id]: { memberId: user.id, memberType: "admin" },
    });
    setIsCreatingGroup(false);
  }, [user.id]);

  // Helper function to check if user can proceed to next step
  const canProceedToNext = Object.entries(selectedMembers).length > 1;

  if (isPrivateChatLoading) {
    return <LoaderScreen message={"Creating conversation"} />;
  }
  return (
    <PopupBox
      className={
        " relative flex flex-col justify-start items-center gap-5 animate-fedin.2s text-center  border-inherit max-w-[30rem] w-full sm:max-h-[60%] h-full shadow-sm *:transition-all *:duration-200 overflow-y-auto"
      }
      action={() => navigate(-1)}
    >
      <header className="sticky bg-inherit z-10 top-0 flex flex-col h-fit justify-start items-center gap-3 w-full p-4 border-b border-inherit">
        <div className="flex justify-between items-center w-full h-fit gap-2">
          {isCreatingGroup && (
            <Ibutton
              action={() => (!next ? handleCancelGroup() : setNext(false))}
              className={"p-1 rounded-lg"}
            >
              Back
            </Ibutton>
          )}
          <h1 className="flex justify-center w-full font-bold text-lg">
            <span>New Conversation</span>
          </h1>
          {isCreatingGroup && canProceedToNext && !next && (
            <Ibutton action={() => setNext(true)} className={"p-1 rounded-lg"}>
              Next
            </Ibutton>
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-2 border-inherit">
          <SearchBar
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder={"Search users..."}
            className={"flex w-full p-1 px-2 border rounded-lg border-inherit"}
          />
          {isCreatingGroup && canProceedToNext && (
            <SelectedGroupMemberList
              handleGroupConfig={handleGroupConfig}
              selectedMembers={selectedMembers}
              users={users}
            />
          )}
          <div className="flex justify-center items-center text-sm gap-1 h-fit">
            {!isCreatingGroup ||
              (!canProceedToNext && (
                <Ibutton
                  action={() => setIsCreatingGroup(true)}
                  className={"p-1 rounded-full"}
                >
                  {icons["plus"]}
                  New group
                </Ibutton>
              ))}
          </div>
        </div>
      </header>

      {!next ? (
        <div
          ref={containerRef}
          className="flex flex-col justify-start items-start h-fit gap-3 w-full no-scrollbar p-4 "
        >
          {users?.map((Usr, idx, arr) => (
            <PeoplesList
              ref={idx === arr.length - 1 ? lastItemRef : null}
              className={"flex justify-between items-center w-full"}
              key={Usr.id}
              person={Usr}
              popover={false}
              action={() =>
                isCreatingGroup
                  ? handleGroupConfig(Usr.id) // Removed unused parameter
                  : privateChatMutaion(Usr?.id)
              }
            >
              {isCreatingGroup && (
                <input
                  className="block shadow-inner rounded-full animate-fedin.2s cursor-pointer"
                  onChange={() => handleGroupConfig(Usr.id)} // Removed unused parameter
                  type="checkbox"
                  checked={!!selectedMembers[Usr.id]}
                  name="userId"
                  id={Usr.id}
                />
              )}
            </PeoplesList>
          ))}
          <div className="w-full min-h-10 ">
            {!isLoading && isFetchingNextPage && (
              <Spinner
                className={"w-5 h-5 p-1 dark:bg-white bg-black m-auto"}
              />
            )}
          </div>
          {!isLoading && users?.length === 0 && (
            <div className="text-gray-500 text-sm">
              No users found for "{search}"
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
