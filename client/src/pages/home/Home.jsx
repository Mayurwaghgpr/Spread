import React, { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
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
import { BsPostcard } from "react-icons/bs";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDeviceSize = useDeviceSize("1023");
  const { fetchDataAll } = PostsApis();
  const selectedTopic = searchParams.get("topic") || "All";
  const selectedFeed = searchParams.get("feed");
  const Icons = useIcons();
  const navigate = useNavigate();
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
          ? lastPage[lastPage.length - 1]?.createdAt
          : undefined;
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

  // Handle errors
  if (isPostError) {
    const errorMessage = errorPosts?.data?.message;
    const statusCode = errorPosts?.status;
    return <ErrorPage message={errorMessage} statusCode={statusCode || 500} />;
  }
  const posts = postsData?.pages.flatMap((page) => page) || [];

  // Navigation items configuration
  const navigationItems = [
    {
      id: "feed",
      label: "Feed",
      isActive: selectedFeed !== "following",
      onClick: () => navigate("/"),
      ariaLabel: "View all feeds",
    },
    {
      id: "following",
      label: "Following",
      isActive: selectedFeed === "following",
      onClick: () => navigate("?feed=following"),
      ariaLabel: "View Following",
    },
    {
      id: "topics",
      label: Icons["plus"],
      isActive: false,
      onClick: () => {},
      ariaLabel: "View specific topics",
    },
  ];

  // Helper function to render posts with WhoToFollow insertion
  const renderPosts = () => {
    if (posts.length === 0 && !isLoading) {
      return (
        <div className="flex items-center justify-center flex-1 p-8">
          <EmptyState
            Icon={BsPostcard}
            heading="No Posts Available"
            description="There are no posts found right now. Check back later for new recommendations."
          />
        </div>
      );
    }

    return posts.map((post, idx, arr) => {
      const isLastItem = idx === arr.length - 1;
      const shouldInsertWhoToFollow = idx === 3 && isDeviceSize;

      if (shouldInsertWhoToFollow) {
        return (
          <React.Fragment key={`fragment-${post.id}`}>
            <WhoToFollow className="w-full  border-inherit p-5 text-sm" />
            <PostPreview
              className="w-full border  pt-2"
              ref={isLastItem ? lastItemRef : null}
              key={post?.id}
              post={post}
            />
          </React.Fragment>
        );
      }

      return (
        <PostPreview
          className="w-full border pt-2  "
          ref={isLastItem ? lastItemRef : null}
          key={post?.id}
          post={post}
        />
      );
    });
  };

  // Render loading skeletons
  const renderLoadingSkeletons = () =>
    Array.from({ length: 10 }, (_, idx) => (
      <PostPreview
        key={`skeleton-${idx}`}
        className="w-full border rounded-lg border-inherit"
      />
    ));

  // Render loading/end state
  const renderListFooter = () => (
    <div className="flex items-center justify-center w-full  sm:pb-16 pb-20">
      {isFetchingNextPage && (
        <Spinner className="w-7 p-1 bg-black dark:bg-white" />
      )}

      {!hasNextPage && !isFetchingNextPage && posts.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 sm:px-4 sm:py-2 py-1 px-2 sm:text-sm text-xs  rounded-full bg-gray-50 dark:bg-white text-gray-500 dark:text-black ">
            <BsPostcard className="w-4 h-4" />
            <span>You've seen all suggestions</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex flex-col w-full h-full border-inherit  ">
        <nav
          className="absolute top-14  z-10 sm:mx-3 sm:w-fit w-full border rounded-lg border-inherit bg-gray-700/0 backdrop-blur-[20px]"
          role="navigation"
          aria-label="Feed navigation"
        >
          <div className="flex items-center justify-start p-3">
            <ul className="flex items-center gap-4 px-4 w-full">
              {navigationItems.map((item) => (
                <li key={item.id} className="flex items-center justify-center">
                  <Ibutton
                    action={item.onClick}
                    aria-label={item.ariaLabel}
                    id={item.id}
                    className={`capitalize transition-opacity duration-200 ${
                      item.isActive
                        ? "opacity-100 underline underline-offset-[1rem]"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    {item.label}
                  </Ibutton>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="sm:px-5 px-2.5 space-y-5 border-inherit py-20 ">
          {/* Posts Container */}
          {isLoading ? renderLoadingSkeletons() : renderPosts()}
          {renderListFooter()}
        </div>
      </div>
      {/* Sidebar - Desktop Only */}
      {!isDeviceSize && (
        <Aside
          handleTopicClick={handleTopicClick}
          className=" sticky top-0 z-20 bg-light dark:bg-dark flex flex-col gap-5 p-6 text-xs border-inherit border-l w-1/2"
        />
      )}
    </>
  );
}

export default Home;
