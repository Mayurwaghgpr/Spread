import React, { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import userApi from "../Apis/userApi";
import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import { useLastPostObserver } from "../hooks/useLastPostObserver";
import { useSelector } from "react-redux";
import ProfileButton from "../component/ProfileButton";

const ReadList = () => {
  const { getArchivedPosts } = userApi();
  const { user, isLogin } = useSelector((state) => state.auth);
  const {
    data,
    error,
    isError,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts"],
    ({ pageParam = 1 }) => getArchivedPosts({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.length > 1 ? allPages.length + 1 : undefined,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
  // console.log({ pages });
  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  // console.log("saved", data);
  const pages = data?.pages.flatMap((page) => page) || [];
  const hasPosts = pages?.length > 0;

  return (
    <main className="relative w-full flex justify-center h-screen  items-center flex-col bg-inherit dark:*:border-[#383838] dark:bg-black">
      <div className="h-full flex justify-start flex-col mt-[10rem] items-center  sm:w-fit w-full bg-inherit">
        <div className="fixed top-16 z-5 p-5 flex  w-full justify-center items-center gap-4 border border-inherit rounded-b-lg bg-inherit">
          <div className=" text-3xl bg-[#f3efeb]  h-full bg-inherit">
            <h1>Read list </h1>
          </div>
        </div>
        {!isLoading
          ? pages?.map((page, idx) => {
              return (
                <PostPreview
                  className={" "}
                  ref={pages?.length % 3 === 0 ? lastpostRef : null}
                  key={idx}
                  post={page}
                  Saved={true}
                />
              );
            })
          : [...Array(3)].map((_, idx) => (
              <PostPreview key={idx} className="border-inherit px-2" />
            ))}
        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center h-full p-5">
            <Spinner
              className={"w-10 h-10 border-t-black dark:border-t-white"}
            />
          </div>
        )}
        {!hasPosts && (
          <div className=" m-auto text-xl">
            <p>Nothing to Read</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ReadList;
