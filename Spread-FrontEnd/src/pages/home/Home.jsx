import React, { useCallback, lazy, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";

const SomthingWentWrong = lazy(() => import("../ErrorPages/somthingWentWrong"));
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
    ({ pageParam = 1 }) => fetchDataAll({ pageParam, topic: selectedTopic }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      refetchOnWindowFocus: false,
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
  const posts = postsData?.pages.flatMap((page) => page.posts) || [];
  console.log(postsData);
  return (
    <section className="relative flex flex-col sm:flex-row gap-3 lg:justify-end lg:px-10 justify-end w-full border-inherit transition-all duration-300 ease-in-out dark:border-[#383838]">
      {/* Posts Section */}
      <div className="relative flex py-[4rem] flex-col h-full items-end border-inherit xl:w-[57%] lg:w-[55%] md:w-[75%] w-full">
        {/* Topics Section */}
        <div className="flex w-full sm:text-xl font-medium bg-gray-700 bg-opacity-0 overflow-hidden backdrop-blur-[20px] dark:border-[#383838] z-[5] border border-t-0 items-center justify-start gap-3 sticky top-[4rem]">
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
        {isLoading
          ? Array.from({ length: 3 }, (_, idx) => (
              <PostPreview key={idx} className="" />
            ))
          : posts.map((post, idx, arr) => {
              return idx === 3 && isDeviceSize ? (
                <>
                  {" "}
                  <WhoToFollow
                    PrepsData={prepsData}
                    className="w-full h-full text-sm p-5 border-b  border-inherit"
                    FechingPreps={fetchingPreps}
                  />
                  <PostPreview
                    className="border-inherit border-b pt-2"
                    ref={arr.length % 3 === 0 ? lastpostRef : null}
                    key={post?.id}
                    post={post}
                  />
                </>
              ) : (
                <PostPreview
                  className="border-inherit border-b pt-2"
                  ref={arr.length % 3 === 0 ? lastpostRef : null}
                  key={post?.id}
                  post={post}
                />
              );
            })}
        {isFetchingNextPage && <PostPreview className="" />}
        {!posts.length && !isLoading && (
          <div className="w-full flex justify-center items-center">
            <h2 className="text-xl">No posts</h2>
          </div>
        )}
      </div>

      <Aside
        className="lg:flex hidden text-xs border-inherit max-w-[20rem] w-full flex-col mt-[4.3rem] justify-start gap-5"
        FechingPreps={fetchingPreps}
        isLoadingPreps={isLoadingPreps}
        PrepsData={prepsData}
        handleTopicClick={handleTopicClick}
      />
    </section>
  );
}

export default Home;
