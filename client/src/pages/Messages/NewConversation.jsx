import React, { memo, useCallback, useRef, useState } from "react";
import { PopupBox } from "../../component/utilityComp/PopupBox";
import SearchBar from "../../component/inputComponents/SearchBar";
import PeoplesList from "../../component/PeoplesList";
import { useDispatch, useSelector } from "react-redux";
import Ibutton from "../../component/buttons/Ibutton";
import { useInfiniteQuery, useMutation } from "react-query";
import usePublicApis from "../../Apis/publicApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
// import ChatApi from "../../Apis/ChatApi";
import { useNavigate } from "react-router-dom";
// import { setToast } from "../../redux/slices/uiSlice";
import LoaderScreen from "../../component/loaders/loaderScreen";
import { BsPlus } from "react-icons/bs";
import GroupCreation from "./components/GroupCreation";
import SelectedGroupMemberList from "./components/SelectedGroupMemberList";
import Spinner from "../../component/loaders/Spinner";
import usePrivateChatMutation from "../../hooks/usePrivateChatMutation";

const NewConversation = () => {
  const { user } = useSelector((state) => state.auth);
  const [isCreatingGroup, setCreatingGroup] = useState(false);
  const [next, setNext] = useState(false);
  const [hashMap, setHashMap] = useState({
    [user.id]: { memberId: user.id, memberType: "admin" },
  });
  const containerRef = useRef(null);

  //Api functions providers
  const { fetchAllUsers } = usePublicApis();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { PrivateMutaion, isPrivateLoading } = usePrivateChatMutation();
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["UsersList"],
    ({ pageParam = new Date().toISOString() }) => fetchAllUsers(pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined; // Use last item timestamp as cursor
      },
      refetchOnWindowFocus: false,
    }
  );
  // console.log(data);
  const users = data?.pages?.flatMap((page) => page);
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  if (isPrivateLoading) {
    <LoaderScreen message={"Creating conversation"} />;
  }

  const handleGroupConfig = useCallback(
    (id) => {
      setHashMap((prev) => {
        const newMap = { ...prev };
        if (newMap[id]) {
          delete newMap[id];
        } else {
          newMap[id] = { memberId: id };
        }
        return newMap;
      });
    },
    [isCreatingGroup]
  );
  const handelCancelGroup = useCallback(() => {
    if (Object.entries(hashMap).length < 1) {
      setNext(false);
    }
    setHashMap({ [user.id]: { ...hashMap[user.id] } });
    setCreatingGroup(false);
  }, [hashMap, isCreatingGroup]);

  return (
    <PopupBox
      className={
        "flex flex-col justify-start items-center gap-5 animate-fedin.2s text-center p-4 border-inherit max-w-[30rem] w-full sm:max-h-[60%] h-full min-h-[60%] shadow-sm overflow-auto"
      }
      action={() => navigate(-1)}
    >
      <header className="flex justify-between items-center w-full">
        {isCreatingGroup && (
          <Ibutton
            action={() => (!next ? handelCancelGroup() : setNext(false))}
            className={"p-1 rounded-lg"}
          >
            Back
          </Ibutton>
        )}
        <h1 className="flex justify-center w-full font-bold text-lg">
          <span> New Conversation</span>
        </h1>
        {isCreatingGroup && Object.entries(hashMap).length > 1 && !next && (
          <Ibutton action={() => setNext(true)} className={"p-1 rounded-lg"}>
            Next
          </Ibutton>
        )}
      </header>
      {!next ? (
        <>
          <SearchBar
            className={"flex w-full p-1 px-2 border rounded-lg border-inherit"}
          />
          {isCreatingGroup && Object.entries(hashMap).length > 1 && (
            <SelectedGroupMemberList
              handleGroupConfig={handleGroupConfig}
              hashMap={hashMap}
              users={users}
            />
          )}
          <div className="flex justify-center items-center text-sm gap-1">
            {!isCreatingGroup && (
              <Ibutton
                action={() => setCreatingGroup(true)}
                className={"p-1 rounded-full"}
              >
                <BsPlus />
                New group
              </Ibutton>
            )}
          </div>

          <div
            ref={containerRef}
            className="flex flex-col justify-start items-start h-full gap-3 w-full overflow-y-auto  no-scrollbar"
          >
            {users?.map((Usr, idx, arr) => (
              <PeoplesList
                ref={idx === arr.length - 1 ? lastItemRef : null}
                className={"flex justify-between items-center w-full"}
                key={Usr.id}
                people={Usr}
                popover={false}
                action={() =>
                  isCreatingGroup
                    ? handleGroupConfig(Usr.id, Usr.userImage)
                    : PrivateMutaion(Usr?.id)
                }
              >
                {isCreatingGroup && (
                  <input
                    className="block shadow-inner rounded-full animate-fedin.2s cursor-pointer"
                    onChange={() => handleGroupConfig(Usr.id, Usr.userImage)}
                    type="checkbox"
                    checked={!!hashMap[Usr.id]}
                    name="userId"
                    id={Usr.id}
                  />
                )}
              </PeoplesList>
            ))}
            {isLoading && (
              <Spinner
                className={"w-10 h-10 p-1 dark:bg-white bg-black m-auto"}
              />
            )}
          </div>
        </>
      ) : (
        <GroupCreation
          setNext={setNext}
          hashMap={hashMap}
          handleGroupConfig={handleGroupConfig}
          users={users}
        />
      )}
    </PopupBox>
  );
};

export default memo(NewConversation);
