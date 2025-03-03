import React, { useCallback, lazy, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";

const SomethingWentWrong = lazy(
  () => import("../ErrorPages/somthingWentWrong")
);
import PostPreview from "../../component/postsComp/PostPreview";
import Spinner from "../../component/loaders/Spinner";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import usePublicApis from "../../Apis/publicApis";
import Aside from "../../component/homeComp/Aside";
import PostsApis from "../../Apis/PostsApis";
import WhoToFollow from "./WhoToFollow";
import useDeviceSize from "../../hooks/useDeviceSize";
import ErrorPage from "../ErrorPages/ErrorPage";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDeviceSize = useDeviceSize("1023");
  const { fetchHomeContent } = usePublicApis();
  const { fetchDataAll } = PostsApis();

  const selectedTopic = searchParams.get("topic") || "All";

  const {
    isLoading: isLoadingHome,
    isFetching: fetchingHome,
    error: errorHome,
    isError: isHomeError,
    data: homeData,
  } = useQuery("homeContent", fetchHomeContent, {
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: postsData,
    error: errorPosts,
    isError: isPostError,
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
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined; // Use last post's timestamp as cursor
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

  const handleTopicClick = useCallback(
    (topic) => setSearchParams({ topic }),
    [setSearchParams]
  );

  if (isHomeError || isPostError) {
    const errorMessage = errorHome?.data?.message || errorPosts?.data?.message;
    const statusCode = errorHome?.status || errorPosts?.status;
    return (
      <ErrorPage
        message={errorMessage || errorHome?.message}
        statusCode={statusCode || 500}
      />
    );
  }

  const posts = postsData?.pages.flatMap((page) => page) || [];
  const renderPost = (post, idx, arr) => {
    if (idx === 3 && isDeviceSize) {
      return (
        <React.Fragment key={`who-to-follow-${post.id}`}>
          <WhoToFollow
            homeData={homeData}
            className="w-full  text-sm p-5 border-b border-inherit"
            FechingPreps={fetchingHome}
          />
          <PostPreview
            className="border-inherit border-b pt-2"
            ref={arr.length % 3 === 0 ? lastItemRef : null}
            key={post?.id}
            post={post}
          />
        </React.Fragment>
      );
    }
    return (
      <PostPreview
        className="border-inherit border-b pt-2"
        ref={arr.length % 3 === 0 ? lastItemRef : null}
        key={post?.id}
        post={post}
      />
    );
  };

  return (
    <section className="flex flex-col sm:flex-row  lg:justify-start  w-full h-screen border-inherit transition-all duration-300 ease-in-out dark:border-[#383838] overflow-y-auto">
      {/* Posts Section */}
      <div className="relative  flex flex-col items-end border-inherit py-24 sm:w-[35rem] lg:w-full mx-auto">
        {/* Sticky Navigation */}
        <div className="flex xl:w-[48rem] lg:w-[40rem] sm:w-[35rem] mx-auto w-full  text-sm sm:text-base md:text-lg lg:text-xl font-medium bg-gray-700 bg-opacity-0   backdrop-blur-[20px] dark:border-[#383838] z-20 border  items-center justify-start fixed top-[3.1rem] sm:top-[3.6rem] ">
          <ul className="flex items-center justify-between w-full ">
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
        FechingPreps={fetchingHome}
        isLoadingHome={isLoadingHome}
        homeData={homeData}
        handleTopicClick={handleTopicClick}
      />
    </section>
  );
}

export default Home;
