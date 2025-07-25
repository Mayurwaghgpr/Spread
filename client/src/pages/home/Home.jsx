import React, { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";
import usePublicApis from "../../services/publicApis";
import PostPreview from "../../component/postsComp/PostPreview";
import Spinner from "../../component/loaders/Spinner";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import Aside from "../../component/layout/Aside";
import PostsApis from "../../services/PostsApis";
import WhoToFollow from "./WhoToFollow";
import useDeviceSize from "../../hooks/useDeviceSize";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../../component/buttons/Ibutton";
import ErrorPage from "../ErrorPages/ErrorPage";
import EmptyState from "../../component/utilityComp/EmptyState";
import { BsPostage, BsPostcard } from "react-icons/bs";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDeviceSize = useDeviceSize("1023");
  const { fetchDataAll } = PostsApis();
  const selectedTopic = searchParams.get("topic") || "All";
  const selectedFeed = searchParams.get("feed"); // Note: This is defined but unused
  const { fetchHomeContent } = usePublicApis();
  const Icons = useIcons();
  const navigate = useNavigate();

  // Fetch home content data
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

  // Fetch posts with infinite scrolling
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
    ["Allposts", selectedTopic, selectedFeed],
    ({ pageParam = new Date().toISOString() }) =>
      fetchDataAll({ pageParam, topic: selectedTopic, endpoint: selectedFeed }),
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
    hasNextPage,
    1
  );

  // Handle post data fetch errors
  if (isPostError) {
    const errorMessage = errorPosts?.data?.message;
    const statusCode = errorPosts?.status;
    return <ErrorPage message={errorMessage} statusCode={statusCode || 500} />;
  }

  // Handle home content data fetch errors
  if (isHomeError) {
    const errorMessage = errorHome?.data?.message;
    const statusCode = errorHome?.status;
    return <ErrorPage message={errorMessage} statusCode={statusCode || 500} />;
  }

  const posts = postsData?.pages.flatMap((page) => page) || [];

  // Helper function to render posts with WhoToFollow inserted at index 3 on smaller devices
  const renderPosts = () => {
    return posts.map((post, idx, arr) => {
      // Insert WhoToFollow component after the 3rd post on smaller devices
      if (idx === 3 && isDeviceSize) {
        return (
          <React.Fragment key={`fragment-${post.id}`}>
            <WhoToFollow
              userSuggetion={homeData?.userSuggetion}
              className="w-full text-sm p-5 border-b border-inherit"
              isLoadingHome={isLoadingHome}
            />
            <PostPreview
              className="w-full border-inherit border-b pt-2"
              ref={idx === arr.length - 1 ? lastItemRef : null}
              key={post?.id}
              post={post}
            />
          </React.Fragment>
        );
      }

      return (
        <PostPreview
          className={`w-full border-inherit border-b pt-2`}
          ref={idx === arr.length - 1 || idx % 3 === 0 ? lastItemRef : null}
          key={post?.id}
          post={post}
        />
      );
    });
  };

  return (
    <section className="grid grid-cols-10 grid-rows-12 w-full h-screen border-inherit transition-all duration-300 ease-in-out  overflow-y-auto">
      {/* Sticky Navigation */}
      <div className="sticky top-[3.1rem] sm:top-[3.6rem] flex items-center justify-start row-span-1 lg:col-span-6 col-span-full w-full border-b bg-gray-700 bg-opacity-0 backdrop-blur-[20px] border-inherit z-10">
        <ul className="flex items-center justify-start gap-4 px-4 w-full h-full border-inherit">
          <li className="capitalize flex justify-center items-center ">
            <Ibutton
              action={() => navigate("/")}
              aria-label="View all feeds"
              id="all"
              className={
                selectedFeed !== "following"
                  ? "opacity-100  underline underline-offset-[1.5rem] "
                  : "opacity-50"
              }
            >
              Feed
            </Ibutton>
          </li>
          <li className="capitalize flex justify-center items-center">
            <Ibutton
              id={"Following"}
              aria-label="View Following"
              onClick={() => navigate("?feed=following")}
              className={
                selectedFeed === "following"
                  ? " opacity-100 underline underline-offset-[1.5rem]"
                  : "opacity-50"
              }
            >
              Followings
            </Ibutton>
          </li>
          <li className="capitalize flex justify-center items-center">
            <Ibutton aria-label="View specific topics">{Icons["plus"]}</Ibutton>
          </li>
        </ul>
      </div>

      {/* Posts Section */}
      <div className="relative flex flex-col items-end lg:col-span-6 sm:col-start-2 sm:col-span-8 col-span-full row-start-2 row-span-full border-inherit pt-10 ">
        {/* Posts Content */}
        {isLoading
          ? Array.from({ length: 10 }, (_, idx) => (
              <PostPreview key={`skeleton-${idx}`} className="border-inherit" />
            ))
          : renderPosts()}

        <div className=" w-full  ">
          <div className="flex justify-center items-center w-full  h-20  ">
            {isFetchingNextPage && (
              <Spinner className="bg-black dark:bg-white w-10 p-1" />
            )}
            {/* End of list indicater */}
            {!hasNextPage && !isFetchingNextPage && posts.length > 0 && (
              <div className="text-center py-8 w-full">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full">
                  <BsPostcard className="w-4 h-4" />
                  <span>You've seen all suggestions</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {posts.length === 0 && !isLoading && (
          <EmptyState
            Icon={BsPostcard}
            heading={"No Post available"}
            description={
              "There are posts found right now. Check back later for  new recommendations."
            }
          />
        )}
      </div>

      {/* Sidebar */}
      {!isDeviceSize && (
        <Aside
          isLoadingHome={isLoadingHome}
          homeData={homeData}
          handleTopicClick={handleTopicClick}
          className="sticky top-[3rem] lg:flex flex-col justify-start gap-5 col-start-7 col-span-4 row-start-2 row-span-full border-x w-full p-6 border-inherit hidden text-xs z-20"
        />
      )}
    </section>
  );
}

export default Home;
