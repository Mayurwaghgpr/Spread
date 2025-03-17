import React, { useCallback, lazy, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";
import usePublicApis from "../../Apis/publicApis";
const SomethingWentWrong = lazy(
  () => import("../ErrorPages/somthingWentWrong")
);
import PostPreview from "../../component/postsComp/PostPreview";
import Spinner from "../../component/loaders/Spinner";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import Aside from "../../component/homeComp/Aside";
import PostsApis from "../../Apis/PostsApis";
import WhoToFollow from "./WhoToFollow";
import useDeviceSize from "../../hooks/useDeviceSize";
import ErrorPage from "../ErrorPages/ErrorPage";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDeviceSize = useDeviceSize("1023");
  const { fetchDataAll } = PostsApis();
  const selectedTopic = searchParams.get("topic") || "All";
  const { fetchHomeContent } = usePublicApis();

  const {
    isLoading: isLoadingHome,
    error: errorHome,
    isError: isHomeError,
    data: homeData,
  } = useQuery("homeContent", fetchHomeContent, {
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleTopicClick = useCallback(
    (topic) => setSearchParams({ topic }),
    [setSearchParams]
  );

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

  if (isPostError) {
    const errorMessage = errorPosts?.data?.message;
    const statusCode = errorPosts?.status;
    return <ErrorPage message={errorMessage} statusCode={statusCode || 500} />;
  }

  const posts = postsData?.pages.flatMap((page) => page) || [];
  const renderPost = (post, idx, arr) => {
    if (idx === 3 && isDeviceSize) {
      return (
        <React.Fragment key={`who-to-follow-${post.id}`}>
          <WhoToFollow
            homeData={homeData}
            className="w-full  text-sm p-5 border-b border-inherit"
            isLoadingHome={isLoadingHome}
          />
          <PostPreview
            className=" w-full border-inherit border-b pt-2"
            ref={arr.length % 3 === 0 ? lastItemRef : null}
            key={post?.id}
            post={post}
          />
        </React.Fragment>
      );
    }
    return (
      <PostPreview
        className="w-full border-inherit border-b pt-2"
        ref={arr.length % 3 === 0 ? lastItemRef : null}
        key={post?.id}
        post={post}
      />
    );
  };

  return (
    <section className="grid grid-cols-10 grid-rows-12 w-full h-screen border-inherit transition-all duration-300 ease-in-out dark:border-[#383838] overflow-y-auto">
      {/* Sticky Navigation */}
      <div className="sticky top-[3.1rem] sm:top-[3.6rem] row-span-1 lg:col-span-6 col-span-full w-full flex  items-center justify-start border-b text-sm sm:text-base md:text-lg lg:text-xl font-medium bg-gray-700 bg-opacity-0   backdrop-blur-[20px] dark:border-[#383838] z-20  ">
        <ul className="flex items-center justify-between w-full h-full ">
          <li className="capitalize flex justify-center items-center w-full h-full hover:bg-gray-400 hover:bg-opacity-30">
            <button
              className="t-btn"
              onClick={() => handleTopicClick("All")}
              aria-label="View all feeds"
            >
              Feeds
            </button>
          </li>
          <li className="capitalize flex justify-center items-center  w-full  h-full hover:bg-gray-400 hover:bg-opacity-30">
            <Link to="#" aria-label="View specific topics">
              Specific
            </Link>
          </li>
        </ul>
      </div>
      {/* Posts Section */}
      <div className="relative flex flex-col items-end lg:col-span-6 col-start-2 col-span-8   row-start-2 row-span-10  border-inherit py-10  mx-auto">
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
        isLoadingHome={isLoadingHome}
        homeData={homeData}
        handleTopicClick={handleTopicClick}
        className="sticky top-16 lg:flex flex-col justify-start gap-5  col-start-7 col-span-4 row-start-2  row-span-full border-x  w-full  border-inherit   hidden text-xs "
      />
    </section>
  );
}

export default Home;
