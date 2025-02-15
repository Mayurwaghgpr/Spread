import React, { useCallback, lazy, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";

const SomethingWentWrong = lazy(
  () => import("../ErrorPages/somthingWentWrong")
);
import PostPreview from "../../component/postsComp/PostPreview";
import Spinner from "../../component/loaders/Spinner";
import { useLastPostObserver } from "../../hooks/useLastPostObserver";
import usePublicApis from "../../Apis/publicApis";
import Aside from "../../component/homeComp/Aside";
import PostsApis from "../../Apis/PostsApis";
import WhoToFollow from "./WhoToFollow";
import useDeviceSize from "../../hooks/useDeviceSize";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDeviceSize = useDeviceSize("1023");
  const { userPrepsData } = usePublicApis();
  const { fetchDataAll } = PostsApis();

  const selectedTopic = searchParams.get("topic") || "All";

  const {
    isLoading: isLoadingPreps,
    isFetching: fetchingPreps,
    error: errorPreps,
    data: prepsData,
  } = useQuery("userPreps", userPrepsData, {
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: postsData,
    error: errorPosts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["Allposts", selectedTopic],
    ({ pageParam = new Date().toISOString() }) =>
      fetchDataAll({ pageParam, topic: selectedTopic }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length === 0) return undefined; // Stop fetching if no more posts
        // console.log(lastPage[lastPage.length - 1]);
        return lastPage[lastPage.length - 1]?.createdAt; // Use last post's timestamp as cursor
      },
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const handleTopicClick = useCallback(
    (topic) => setSearchParams({ topic }),
    [setSearchParams]
  );

  if (errorPreps || (errorPosts && errorPosts?.status !== 404)) {
    const errorMessage =
      errorPreps?.data ||
      errorPosts?.data ||
      "An error occurred while loading content. Please try again later.";
    return (
      <SomethingWentWrong
        cause={errorPosts?.status || errorPreps?.status}
        message={errorMessage}
      />
    );
  }

  const posts = postsData?.pages.flatMap((page) => page) || [];
  const renderPost = (post, idx, arr) => {
    if (idx === 3 && isDeviceSize) {
      return (
        <React.Fragment key={`who-to-follow-${post.id}`}>
          <WhoToFollow
            PrepsData={prepsData}
            className="w-full  text-sm p-5 border-b border-inherit"
            FechingPreps={fetchingPreps}
          />
          <PostPreview
            className="border-inherit border-b pt-2"
            ref={arr.length % 3 === 0 ? lastpostRef : null}
            key={post?.id}
            post={post}
          />
        </React.Fragment>
      );
    }
    return (
      <PostPreview
        className="border-inherit border-b pt-2"
        ref={arr.length % 3 === 0 ? lastpostRef : null}
        key={post?.id}
        post={post}
      />
    );
  };

  return (
    <section className="relative flex flex-col sm:flex-row  lg:justify-start  w-full h-screen border-inherit transition-all duration-300 ease-in-out dark:border-[#383838] overflow-y-auto">
      {/* Posts Section */}
      <div className="  flex flex-col items-end border-inherit py-24 w-full">
        {/* Sticky Navigation */}
        <div className="flex lg:max-w-[50rem] w-full text-sm sm:text-base md:text-lg lg:text-xl font-medium bg-gray-700 bg-opacity-0  overflow-x-auto sm:overflow-hidden backdrop-blur-[20px] dark:border-[#383838] z-20 border border-t-0 items-center justify-start fixed top-[3.1rem] sm:top-[3.6rem] hide-scrollbar">
          <ul className="flex h-full items-center justify-between w-full  ">
            <li className="capitalize flex justify-center w-full h-full  p-4 hover:bg-gray-400 hover:bg-opacity-30">
              <button
                className="t-btn"
                onClick={() => handleTopicClick("All")}
                aria-label="View all feeds"
              >
                Feeds
              </button>
            </li>
            <li className="capitalize flex justify-center  p-4  w-full hover:bg-gray-400 hover:bg-opacity-30">
              <Link to="#" aria-label="View specific topics">
                Specific
              </Link>
            </li>
          </ul>
        </div>

        {/* Posts Content */}
        <div className="w-full pt-4 border-inherit">
          {isLoading
            ? Array.from({ length: 3 }, (_, idx) => (
                <PostPreview key={idx} className="border-inherit" />
              ))
            : posts.map(renderPost)}
          {isFetchingNextPage && (
            <div className="w-full flex justify-center items-center py-4">
              <Spinner className={"bg-black dark:bg-white w-10 p-1"} />
            </div>
          )}
          {!posts.length && !isLoading && (
            <div className="w-full flex justify-center items-center py-4">
              <h2 className="text-xl">No posts</h2>
            </div>
          )}
        </div>
      </div>

      <Aside
        className="lg:flex hidden text-xs border-inherit max-w-[25rem] w-full h-screen flex-col border-x   justify-start gap-5 sticky top-14"
        FechingPreps={fetchingPreps}
        isLoadingPreps={isLoadingPreps}
        PrepsData={prepsData}
        handleTopicClick={handleTopicClick}
      />
    </section>
  );
}

export default Home;
