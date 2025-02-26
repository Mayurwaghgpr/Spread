import React, { useMemo } from "react";
import { useInfiniteQuery } from "react-query";

import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import { useLastPostObserver } from "../hooks/useLastPostObserver";
import { useSelector } from "react-redux";
import useProfileApi from "../Apis/ProfileApis";

const ReadList = () => {
  const { getArchivedPosts } = useProfileApi();
  const { user, isLogin } = useSelector((state) => state.auth);
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
  const { lastpostRef } = useLastPostObserver(
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
    <section className="flex flex-col justify-start items-start w-full h-screen xl:items-center  bg-inherit dark:*:border-[#383838] dark:bg-black  overflow-y-auto">
      <div className="relative flex flex-col justify-start items-center  md:w-fit w-full my-36 bg-inherit ">
        <div className="fixed top-16 z-10 flex right-0 w-full justify-end items-center gap-4 border-inherit ">
          <div className=" text-3xl bg-[#f3efeb] p-5 md:w-[80%] xl:w-[78%] w-full dark:bg-black h-full border border-inherit rounded-b-lg">
            <h1>Read list </h1>
          </div>
        </div>
        {!isLoading
          ? pages?.map((page, idx) => {
              return (
                <PostPreview
                  className={"max-w-[45rem]"}
                  ref={pages?.length % 3 === 0 ? lastpostRef : null}
                  key={idx}
                  post={page}
                  Saved={true}
                />
              );
            })
          : [...Array(3)].map((_, idx) => (
              <PostPreview key={idx} className="border-inherit " />
            ))}
        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center h-full p-5">
            <Spinner
              className={"w-10 h-10 border-t-black dark:border-t-white"}
            />
          </div>
        )}
        {/* {!hasPosts && (
          <div className=" m-auto text-xl">
            <p>Nothing to Read</p>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default ReadList;
