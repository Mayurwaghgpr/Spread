import React, { useCallback, lazy } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";

const SomthingWentWrong = lazy(() => import("./ErrorPages/somthingWentWrong"));

import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import { useLastPostObserver } from "../hooks/useLastPostObserver";

import usePublicApis from "../Apis/publicApis";
import Aside from "../component/homeComp/Aside";
import PostsApis from "../Apis/PostsApis";
import LikesList from "../component/buttons/Like/LikesList";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPrepsData } = usePublicApis();
  const { fetchDataAll } = PostsApis();

  const selectedTopic = searchParams.get("topic");

  // Fetch user preferences
  const {
    isLoading: isLoadingPreps,
    isFetching: fetchingPreps,
    error: errorPreps,
    data: prepsData,
  } = useQuery("userPreps", userPrepsData, {
    staleTime: 1000 * 60 * 10,
  });

  // Fetch posts with infinite scrolling
  const {
    data: postsData,
    error: errorPosts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["Allposts", selectedTopic],
    ({ pageParam = 1 }) => fetchDataAll({ pageParam, topic: selectedTopic }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.length > 1 ? allPages.length + 1 : undefined,
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  // Handle topic change
  const handleTopicClick = useCallback(
    (topic) => setSearchParams({ topic }),
    [setSearchParams]
  );

  // Handle errors
  if (errorPreps || (errorPosts && errorPosts?.status !== 404)) {
    return (
      <SomthingWentWrong
        cause={errorPosts?.status || errorPreps?.status}
        message={
          errorPreps?.data ||
          errorPosts?.data ||
          "An error occurred while loading content. Please try again later."
        }
      />
    );
  }

  const posts = postsData?.pages.flatMap((page) => page) || [];

  return (
    <main className=" flex flex-col sm:flex-row justify-end w-full border-inherit transition-all duration-300 ease-in-out dark:border-[#383838]">
      {/* Posts Section */}
      <div className=" relative flex py-16 flex-col h-full items-end border-inherit  xl:m-0 sm:w-[35rem] lg:w-[45rem] w-full">
        {/* Topics Section */}
        <div className="flex w-full text-lg font-medium bg-gray-700 bg-opacity-0 overflow-hidden backdrop-blur-[20px] dark:border-[#383838] z-[5] border rounded items-center justify-start gap-3 sticky top-16">
          <ul className="flex h-full items-center justify-between w-full">
            <li className="capitalize flex justify-center p-2 w-full hover:bg-gray-400 hover:bg-opacity-30">
              <button
                className="t-btn"
                onClick={() => handleTopicClick("All")}
                aria-label="View all feeds"
              >
                Feeds
              </button>
            </li>
            <li className="capitalize flex justify-center p-2 w-full hover:bg-gray-400 hover:bg-opacity-30">
              <Link to="#" aria-label="View specific topics">
                Specific
              </Link>
            </li>
          </ul>
        </div>

        {/* Posts List */}
        {posts.map((post, idx, arr) => (
          <PostPreview
            className="border-inherit px-2"
            ref={arr.length % 3 === 0 ? lastpostRef : null}
            key={post?.id}
            post={post}
          />
        ))}

        {/* Loading Spinner */}
        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center h-full p-5">
            <Spinner />
          </div>
        )}

        {/* No Posts */}
        {!postsData && <h2 className="m-auto text-xl">No posts</h2>}
      </div>

      {/* Aside Section */}
      <Aside
        className="lg:flex hidden text-xs border-inherit flex-col w-[20rem] lg:w-[23] xl:w-[26rem] mt-20 px-10 justify-start gap-5"
        FechingPreps={fetchingPreps}
        isLoadingPreps={isLoadingPreps}
        PrepsData={prepsData}
        handleTopicClick={handleTopicClick}
      />
    </main>
  );
}

export default Home;
