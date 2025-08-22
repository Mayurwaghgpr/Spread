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
    <div className=" flex flex-col justify-start items-start w-full h-full  xl:items-center dark:*:border-[#383838]  ">
      <div className=" sticky top-0 flex  justify-end items-center gap-4 w-full z-10  border-inherit  ">
        <div className="w-full h-full p-7 bg-light dark:bg-dark text-3xl  border-b border-inherit">
          <h1>Read list </h1>
        </div>
      </div>
      <div className="pb-20 max-w-2xl w-full">
        {(!isLoading ? pages : [...Array(3)])?.map((page, idx) => (
          <PostPreview
            className={" w-full  border-inherit"}
            ref={pages?.length % 3 === 0 ? lastItemRef : null}
            key={idx}
            post={page}
            Saved={true}
          />
        ))}

        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center h-full p-5">
            <Spinner
              className={"w-8 h-8 p-1 border-t-black dark:border-t-white"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadList;
