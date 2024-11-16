import React, { useCallback, lazy } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useInfiniteQuery, useQuery } from "react-query";

const PostPreview = lazy(() => import("../component/postsComp/PostPreview"));
const SomthingWentWrong = lazy(() => import("./ErrorPages/somthingWentWrong"));
const Spinner = lazy(() => import("../component/loaders/Spinner"));
import useLastPostObserver from "../hooks/useLastPostObserver";
import usePublicApis from "../Apis/publicApis";
import Aside from "../component/homeComp/Aside";
import PostsApis from "../Apis/PostsApis";

function Viewblogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userPrepsData } = usePublicApis();
  const { fetchDataAll } = PostsApis();

  const selectedTopic = searchParams.get("topic");

  const {
    isLoading: isLoadingPreps,
    isFetching: fetchingPreps,
    error: errorPreps,
    data: prepsData,
  } = useQuery("userPreps", userPrepsData, {
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: postsData,
    error: errorPosts,
    isError: isPostError,
    isFetching,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ["Allposts", selectedTopic],
    ({ pageParam = 1 }) => fetchDataAll({ pageParam, topic: selectedTopic }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.length ? allPages.length + 1 : undefined,
      retry: false,
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const handleTopicClick = useCallback(
    (topic) => {
      setSearchParams({ topic });
      refetch();
    },
    [setSearchParams, refetch]
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

  return (
    <main className="flex flex-col relative sm:flex-row   justify-end  w-full bottom-0 border-inherit transition-all duration-300 ease-in-out dark:border-[#383838]">
      <div className="flex flex-col items-end  relative w-[43rem]  mx-10">
        <div className="flex transition-all text-xl font-medium duration-200 bg-opacity-0 overflow-hidden backdrop-blur-[10px] dark:border-[#383838] ease-in-out z-[5]  border rounded-lg  items-center  justify-start gap-3 w-full  sticky top-20 ">
          <ul className="flex h-full items-center justify-between overflow-hidden bg-inherit w-full border-inherit">
            <li className="capitalize p-1.5 bg-inherit flex justify-center w-full hover:bg-gray-500 hover:bg-opacity-30">
              <button
                className="t-btn"
                onClick={() => handleTopicClick("All")}
                aria-label="Select all topics"
              >
                Feeds
              </button>
            </li>
            <li className="capitalize p-1.5 bg-inherit flex justify-center w-full  hover:bg-gray-500  hover:bg-opacity-30">
              <Link to="#" aria-label="Specialization">
                Specialization
              </Link>
            </li>
          </ul>
        </div>
        <div
          id="PostContainer"
          className={`relative flex flex-col   mt-16 ${
            !postsData && " py-10 "
          } w-full lg:w-[46rem]   sm:px-10 dark:border-[#383838] border-inherit`}
        >
          {postsData?.pages?.map((page) =>
            page?.map((post, idx, arr) => (
              <PostPreview
                className="border-inherit p-3"
                ref={
                  arr?.length > 3 && arr?.length === idx + 1
                    ? lastpostRef
                    : null
                }
                key={post?.id}
                post={post}
              />
            ))
          )}
          {isFetchingNextPage && (
            <div className="w-full flex justify-center items-center h-full p-5">
              <Spinner />
            </div>
          )}
          {!postsData && (
            <div className="flex justify-center items-center w-full h-full text-3xl ">
              <h2>No posts</h2>
            </div>
          )}
        </div>
      </div>{" "}
      <Aside
        className="lg:flex hidden  border-inherit flex-col w-[24rem] mt-20  px-10  justify-start gap-5  "
        FechingPreps={fetchingPreps}
        isLoadingPreps={isLoadingPreps}
        PrepsData={prepsData}
        handleTopicClick={handleTopicClick}
      />
    </main>
  );
}

export default Viewblogs;
