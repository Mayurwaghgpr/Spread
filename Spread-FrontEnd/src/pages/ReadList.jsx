import React, { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import userApi from "../Apis/userApi";
import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import useLastPostObserver from "../hooks/useLastPostObserver";
import { useSelector } from "react-redux";

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
        lastPage?.length ? allPages.length + 1 : undefined,
      retry: false,
    }
  );

  const pages = useMemo(() => data?.pages || [], [data?.pages]);
  const hasPosts = pages?.some((page) => page?.length > 0);

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  return (
    <div className="relative w-full flex justify-center  items-center flex-col bg-inherit bg-white dark:*:border-[#383838] dark:bg-black">
      <div className="h-full flex justify-center flex-col mt-16 items-center sm:w-fit w-full bg-inherit">
        <div className="fixed top-16 z-10 p-5 flex flex-col sm:w-[50rem] w-full justify-start items-start gap-4 border border-inherit rounded-b-lg bg-inherit">
          <div className=" flex justify-center gap-4 items-center">
            <img
              className=" w-10  h-10 rounded-full"
              src={user.userImage}
              alt=""
            />
            <h2>{user.username}</h2>
          </div>
          <div className="w-full text-3xl  h-full bg-inherit">
            <h1>Read </h1>
          </div>
        </div>
        {hasPosts ? (
          <div
            id="PostContainer"
            className="relative flex flex-col h-full w-full px-3"
          >
            {pages.map(
              (page) =>
                Array.isArray(page) &&
                page.map((post, idx) => (
                  <PostPreview
                    className={" "}
                    ref={page.length === idx + 1 ? lastpostRef : null}
                    key={post.id}
                    post={post}
                    Saved={true}
                  />
                ))
            )}
            {isFetchingNextPage && (
              <div className="w-full flex justify-center items-center h-full p-5">
                <Spinner />
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex justify-center items-center  w-full text-2xl  text-center min-h-[60vh] mt-9">
            <div className="">
              <p>Nothing to Read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadList;
