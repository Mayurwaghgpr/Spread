import axios from "axios";
import React, { memo } from "react";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
import { IoPersonAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import { useInfiniteQuery, useQuery } from "react-query";
import ChatApi from "../../Apis/ChatApi";
import { useLastPostObserver } from "../../hooks/useLastPostObserver";
function MessageLog() {
  const { user } = useSelector((state) => state.auth);
  const { getConversations } = ChatApi();
  const navigate = useNavigate();

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
  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  const conversations = data?.pages?.flatMap((page) => page);
  return (
    <aside className=" border-r sm:max-w-[30%] sm:min-w-fit w-full  h-full border-inherit ">
      <div>
        <button
          onClick={() => navigate(-1)}
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
            <button className="">
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
          {conversations?.map((conv, arr) => (
            <Link
              ref={arr.length % 10 === 0 ? lastpostRef : null}
              to={`c/messages?Id=${conv.id}`}
              replace
              key={conv.id}
              className=" flex items-center gap-3 w-full  "
            >
              <div>
                <div className="w-10 h-10">
                  <img
                    className=" w-full h-full object-cover object-center rounded-full"
                    src={
                      conv.convesationType !== "group"
                        ? conv?.members?.find((m) => m.id != user.id).userImage
                        : conv?.image
                    }
                    alt={
                      conv.convesationType !== "group"
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
                  {conv.convesationType !== "group"
                    ? conv?.members?.find((m) => m.id != user.id)?.displayName
                    : conv?.groupName}
                </h2>
                <div className="flex  items-center text-xs text-black dark:text-opacity-40 dark:text-white text-opacity-40 gap-2">
                  {" "}
                  <p className=" ">{conv?.lastMessage}</p>
                  <FormatedTime date={conv?.createdAt} />
                  {/* <span>{user.timestamp}</span> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default memo(MessageLog);
