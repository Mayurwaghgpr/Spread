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
import SideBar from "../component/homeComp/SideBar";
import LoaderScreen from "../component/loaders/loaderScreen";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLogin, user } = useSelector((state) => state.auth);
  const { MenuOpen } = useSelector((state) => state.ui);
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
      getNextPageParam: (lastPage, allPages) => {
        console.log(lastPage.length, allPages);
        lastPage?.length ? allPages.length + 1 : undefined;
      },
    }
  );
  console.log({ hasNextPage, isFetchingNextPage });

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const handleTopicClick = useCallback((topic) => {
    setSearchParams({ topic });
  }, []);

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
  console.log(postsData);
  const posts = postsData?.pages.flatMap((page) => page) || [];

  return (
    <main className=" flex flex-col sm:flex-row justify-end h-full  w-full  border-inherit transition-all duration-300 ease-in-out dark:border-[#383838]">
      <div className="relative flex h-full flex-col border-inherit items-end mt-16 rounded-t-md border border-y-0   lg:w-[35rem] xl:w-[45rem] w-full ">
        <div className="flex w-full text-lg font-medium  bg-gray-700 bg-opacity-0 overflow-hidden backdrop-blur-[20px] dark:border-[#383838] ease-in-out z-[5]  border rounded  items-center  justify-start gap-3 sticky top-16 ">
          <ul className="flex h-full  items-center *:transition-all *:duration-300 justify-between overflow-hidden bg-inherit w-full border-inherit">
            <li className="capitalize bg-inherit flex justify-center  p-2 w-full  hover:bg-gray-400 hover:bg-opacity-30">
              <button
                className="t-btn"
                onClick={() => handleTopicClick("All")}
                aria-label="Select all topics"
              >
                Feeds
              </button>
            </li>
            <li className="capitalize  bg-inherit flex justify-center p-2 w-full  hover:bg-gray-400  hover:bg-opacity-30">
              <Link to="#" aria-label="Specialization">
                specific
              </Link>
            </li>
          </ul>
        </div>
        {posts?.map(
          (post, idx, arr) => (
            console.log(arr?.length === idx + 1),
            (
              <PostPreview
                className="border-inherit px-2"
                ref={arr?.length === idx + 1 ? lastpostRef : null}
                key={post?.id}
                post={post}
              />
            )
          )
        )}
        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center h-full p-5">
            <Spinner />
          </div>
        )}
        {!postsData && <h2 className="m-auto text-xl">No posts</h2>}
      </div>
      <Aside
        className="lg:flex hidden  border-inherit flex-col w-[25rem] xl:w-[26rem] mt-20  px-10  justify-start gap-5  "
        FechingPreps={fetchingPreps}
        isLoadingPreps={isLoadingPreps}
        PrepsData={prepsData}
        handleTopicClick={handleTopicClick}
      />
    </main>
  );
}

export default Home;
