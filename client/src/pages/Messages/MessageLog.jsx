import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import { useInfiniteQuery } from "react-query";
import ChatApi from "../../Apis/ChatApi";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import {
  selectConversation,
  setMessageLogData,
  setOpenNewConverstionBox,
} from "../../redux/slices/messangerSlice";
import Spinner from "../../component/loaders/Spinner";
import SearchBar from "../../component/inputComponents/SearchBar";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import ProfileImage from "../../component/ProfileImage";

function MessageLog() {
  const { user } = useSelector((state) => state.auth);
  const { messageLogData } = useSelector((state) => state.messanger);
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
        dispatch(setMessageLogData(data?.pages?.flatMap((page) => page)));
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
      className={`${conversationId ? "sm:block hidden" : "  block"} border-r sm:max-w-[30%] w-full overflow-y-auto   border-inherit `}
    >
      <header className="sticky top-0 flex flex-col gap-7 w-full h-fit p-5 z-10 border-b border-inherit bg-[#fff9f3] dark:bg-black">
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
          <h1>Messages</h1>
          <Ibutton
            className={"p-2 rounded-lg"}
            action={() => dispatch(setOpenNewConverstionBox())}
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
      <section className="border-inherit w-full p-5 ">
        <div className="flex flex-col items-start gap-7 h-full w-full  py-6  no-scrollbar scroll-smooth   ">
          {messageLogData?.map((conv, idx, arr) => (
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
                  <FormatedTime
                    className={"opacity-40 text-xs"}
                    date={conv?.createdAt}
                  />
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
              <Spinner className={"w-10 h-10 bg-black p-1 dark:bg-white"} />
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}

export default memo(MessageLog);
