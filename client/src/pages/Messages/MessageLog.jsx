import axios from "axios";
import React, { memo, useCallback } from "react";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
import { IoPersonAddOutline } from "react-icons/io5";
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
function MessageLog() {
  const { user } = useSelector((state) => state.auth);
  const { getConversations } = ChatApi();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["convesations"],
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
      className={`${conversationId ? "sm:block hidden" : "  block"} border-r sm:max-w-[30%] sm:min-w-fit w-full  h-full border-inherit `}
    >
      <div>
        <button
          onClick={() => navigate(-1, { replace: true })}
          className=" border-inherit p-4 text-2xl font-bold"
        >
          <BsArrowLeft className="" />
        </button>
      </div>
      <div className="px-5 border-inherit">
        <header className=" flex flex-col gap-7 border-inherit">
          <div className="flex text-lg font-bold justify-between border-inherit">
            {" "}
            <h1>Messages</h1>
            <button
              onClick={() => dispatch(setOpenNewConverstionBox())}
              className=""
            >
              {" "}
              <IoPersonAddOutline />
            </button>
          </div>
          <div className=" flex gap-3 items-center border p-1  rounded-lg border-inherit">
            <div className="p-2">
              {" "}
              <BsSearch className="text-[#383838]" />
            </div>

            <input
              className="  p-1 w-full outline-none  placeholder:text-[#383838] bg-inherit border-inherit "
              type="search"
              placeholder="Search"
              name=""
              id=""
            />
          </div>
        </header>
        <div className="flex flex-col items-start max-h-screen w-full  gap-7 py-6 px-4 overflow-y-auto no-scrollbar scroll-smooth ">
          {conversations?.map((conv, idx, arr) => (
            <Link
              onClick={() => haldelSelectConversation(conv)}
              ref={arr.length % 10 === 0 ? lastItemRef : null}
              to={`c?Id=${conv.id}`}
              key={conv.id}
              replace={true}
              className=" flex items-center gap-3 w-full  "
            >
              <div>
                <div className="w-10 h-10">
                  <img
                    className=" w-full h-full object-cover object-center rounded-full"
                    src={
                      conv.conversationType !== "group"
                        ? conv?.members?.find((m) => m.id != user.id)?.userImage
                        : conv?.image
                    }
                    alt={
                      conv.conversationType !== "group"
                        ? conv?.members?.find((m) => m.id != user.id)
                            ?.displayName
                        : conv.groupName
                    }
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                {" "}
                <h2>
                  {conv.conversationType !== "group"
                    ? conv?.members?.find((m) => m.id != user.id)?.displayName
                    : conv?.groupName}
                </h2>
                <div className="flex  items-center text-xs text-black dark:text-opacity-40 dark:text-white text-opacity-40 gap-2">
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
      </div>
    </aside>
  );
}

export default memo(MessageLog);
