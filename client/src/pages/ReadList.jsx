import React, { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import { useLastItemObserver } from "../hooks/useLastItemObserver";
import useProfileApi from "../services/ProfileApis";

const ReadList = () => {
  const { getArchivedPosts } = useProfileApi();
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts"],
    ({ pageParam = new Date().toISOString() }) =>
      getArchivedPosts({ pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined; // Use last post's timestamp as cursor
      },
      refetchOnWindowFocus: false,
    }
  );
  // console.log({ pages });
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  // console.log("saved", data);
  const pages = useMemo(
    () => data?.pages.flatMap((page) => page) || [],
    [data?.pages]
  );

  return (
    <div className="relative flex flex-col justify-start items-start w-full h-full xl:items-center dark:*:border-[#383838] bg-light dark:bg-dark ">
      <div className=" sticky top-0 flex  justify-end items-center gap-4 w-full z-10  border-inherit  ">
        <div className="w-full h-full p-7 bg-light dark:bg-dark text-3xl  border-b border-inherit">
          <h1>Read list </h1>
        </div>
      </div>
      {!isLoading
        ? pages?.map((page, idx) => {
            return (
              <PostPreview
                className={" w-full"}
                ref={pages?.length % 3 === 0 ? lastItemRef : null}
                key={idx}
                post={page}
                Saved={true}
              />
            );
          })
        : [...Array(3)].map((_, idx) => (
            <PostPreview key={idx} className="border-inherit w-full " />
          ))}
      {isFetchingNextPage && (
        <div className="w-full flex justify-center items-center h-full p-5">
          <Spinner className={"w-10 h-10 border-t-black dark:border-t-white"} />
        </div>
      )}
      {/* {!hasPosts && (
          <div className=" m-auto text-xl">
            <p>Nothing to Read</p>
          </div>
        )} */}
    </div>
  );
};

export default ReadList;
