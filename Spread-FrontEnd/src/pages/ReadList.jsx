import React, { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import userApi from "../Apis/userApi";
import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import useLastPostObserver from "../hooks/useLastPostObserver";
import emptyPage from "../assets/empty-page.png";
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
    <div className="relative w-full flex justify-center  items-center flex-col bg-inherit bg-white dark:*:border-[#383838] dark:bg-[#222222]">
      <div className="h-full flex justify-center flex-col mt-20 items-center sm:w-[60%] w-full bg-inherit">
        <div className="sticky top-20 z-10 p-5  font-medium flex flex-col justify-start items-start gap-4 border border-inherit rounded-b-lg  w-full bg-inherit">
          <div className=" flex justify-center gap-4 items-center">
            <img
              className=" w-10  h-10 rounded-full"
              src={user.userImage}
              alt=""
            />
            <h2>{user.username}</h2>
          </div>
          <div className="w-full text-3xl text-center  h-full bg-inherit">
            <h1>Read List</h1>
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
          <div className="relative flex justify-center items-center  w-full text-5xl font-light text-center min-h-[60vh] mt-9">
            <div className="">
              <h1>Empty!</h1>
              <p>Nothing to Read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadList;
