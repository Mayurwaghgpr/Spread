import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import { useInfiniteQuery } from "react-query";
import ChatApi from "../../Apis/ChatApi";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import {
  selectConversation,
  setOpenNewConverstionBox,
} from "../../redux/slices/messangerSlice";
import Spinner from "../../component/loaders/Spinner";
import SearchBar from "../../component/inputComponents/SearchBar";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import ProfileImage from "../../component/ProfileImage";

function MessageLog() {
  const { user } = useSelector((state) => state.auth);
  const { getConversations } = ChatApi();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const icons = useIcons();

  const {
    data,
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
    localStorage.setItem("conversationMeta", JSON.stringify(conv));
  }, []);

  const conversations = data?.pages?.flatMap((page) => page);
  // console.log(conversations);

  return (
    <aside
      className={`${conversationId ? "sm:block hidden" : "  block"} border-r sm:max-w-[25%] sm:min-w-fit w-full p-5  h-full border-inherit `}
    >
      <header className="flex flex-col gap-7 border-inherit">
        <div className="flex justify-start items-center w-full">
          <Ibutton
            className=" border-inherit text-2xl font-bold"
            action={() => navigate(-1, { replace: true })}
          >
            {icons["arrowL"]}
          </Ibutton>
        </div>
        <div className="flex text-lg font-bold justify-between border-inherit">
          {" "}
          <h1>Messages</h1>
          <Ibutton action={() => dispatch(setOpenNewConverstionBox())}>
            {icons["addPersonO"]}
          </Ibutton>
        </div>
        <SearchBar
          className={
            "flex justify-center items-center border border-inherit rounded-lg p-1"
          }
        />
      </header>
      <section className="border-inherit">
        <div className="flex flex-col items-start max-h-screen w-full  gap-7 py-6  overflow-y-auto no-scrollbar scroll-smooth ">
          {conversations?.map((conv, idx, arr) => (
            <Link
              onClick={() => haldelSelectConversation(conv)}
              ref={arr.length % 10 === 0 ? lastItemRef : null}
              to={`c?Id=${conv.id}`}
              key={conv.id}
              replace={true}
              className=" flex items-center gap-3 w-full  "
            >
              <ProfileImage
                className={"w-10 h-10"}
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

              <div>
                {" "}
                <h2>
                  {conv.conversationType !== "group"
                    ? conv?.members?.find((m) => m.id != user.id)?.displayName
                    : conv?.groupName}
                </h2>
                <div className="flex justify-start items-center gap-2 text-xs text-black dark:text-opacity-40 dark:text-white text-opacity-40">
                  {" "}
                  <p className=" ">{conv?.lastMessage}</p>
                  <FormatedTime
                    className={"text-black dark:text-white"}
                    date={conv?.createdAt}
                  />
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
