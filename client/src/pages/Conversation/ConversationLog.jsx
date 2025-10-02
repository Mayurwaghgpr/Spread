import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import ChatApi from "../../services/ChatApi";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import {
  selectConversation,
  setConversationLogData,
} from "../../store/slices/messangerSlice";
import Spinner from "../../component/loaders/Spinner";
import SearchBar from "../../component/inputComponents/SearchBar";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import ProfileImage from "../../component/ProfileImage";
import TimeAgo from "../../component/utilityComp/TimeAgo";

function MessageLog() {
  const { user } = useSelector((state) => state.auth);
  const { conversationLogData } = useSelector((state) => state.messanger);
  const { getConversations } = ChatApi();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const icons = useIcons();

  const {
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["convesationsLog"],
    ({ pageParam = new Date().toISOString() }) =>
      getConversations({ pageParam }),
    {
      onSuccess: (data) => {
        dispatch(setConversationLogData(data?.pages?.flatMap((page) => page)));
      },
      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined; // Use last item timestamp as cursor
      },
      refetchOnWindowFocus: false,
    }
  );
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const haldelSelectConversation = useCallback((conv) => {
    dispatch(selectConversation(conv));
    sessionStorage.setItem("conversationMeta", JSON.stringify(conv));
  }, []);

  return (
    <aside
      className={`${conversationId ? "sm:block hidden" : "block"} border-r lg:max-w-[30%] sm:max-w-[50%] w-full overflow-y-auto   border-inherit `}
    >
      <header className="sticky top-0 flex flex-col gap-7 w-full h-fit p-5 z-10 border-b border-inherit bg-light dark:bg-dark ">
        <div className="flex justify-start items-center h-full w-full">
          <Ibutton
            className="px-2 rounded-lg border-inherit text-2xl font-bold"
            action={() => navigate(-1)}
          >
            {icons["arrowL"]}
          </Ibutton>
        </div>
        <div className="flex text-lg font-bold justify-between border-inherit">
          {" "}
          <h1>Conversation</h1>
          <Ibutton
            className={"p-2 rounded-lg"}
            action={() => navigate("new/c")}
          >
            {icons["addPersonO"]}
          </Ibutton>
        </div>
        <SearchBar
          className={
            "flex justify-center items-center border border-inherit rounded-lg p-1"
          }
        />
      </header>
      <main className=" space-y-4 border-inherit w-full p-5 px-7  text-sm font-light ">
        {conversationLogData?.map((conv, idx, arr) => (
          <Link
            onClick={() => haldelSelectConversation(conv)}
            ref={arr.length % 10 === 0 ? lastItemRef : null}
            to={`c?Id=${conv.id}`}
            replace={conversationId !== null}
            key={conv.id}
            className=" flex justify-start items-start gap-3 w-full  "
          >
            <ProfileImage
              className={"min-w-10 min-h-10 w-10 h-10 "}
              image={
                conv.conversationType !== "group"
                  ? conv?.members?.find((m) => m.id != user.id)?.userImage
                  : conv?.image
              }
              alt={
                conv.conversationType !== "group"
                  ? conv?.members?.find((m) => m.id != user.id)?.displayName
                  : conv.groupName
              }
            />
            <div className="w-full">
              {" "}
              <div className="flex justify-between items-center w-full">
                <h2>
                  {conv.conversationType !== "group"
                    ? conv?.members?.find((m) => m.id != user.id)?.displayName
                    : conv?.groupName}
                </h2>
                <TimeAgo className={"text-xs"} date={conv?.createdAt} />
              </div>
              <div className="flex justify-start items-start gap-2 w-3/4 max-h-14 text-sm  text-ellipsis overflow-hidden opacity-20 ">
                {" "}
                <p className="">{conv?.lastMessage}</p>
                {/* <span>{user.timestamp}</span> */}
              </div>
            </div>
          </Link>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center w-full h-full ">
            <Spinner className={"w-5 h-5 bg-black p-0.5 dark:bg-white"} />
          </div>
        )}
      </main>
    </aside>
  );
}

export default memo(MessageLog);
