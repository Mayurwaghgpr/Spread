import React, { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostPreview from "../../components/postsComp/PostPreview";
import Spinner from "../../components/loaders/Spinner";
import PostCardSkeleton from "../../components/loaders/PostCardSkeleton";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import Aside from "../../components/layout/Aside";
import usePostsApis from "../../services/usePostsApis";
import WhoToFollow from "./WhoToFollow";
import useDeviceSize from "../../hooks/useDeviceSize";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../../components/buttons/Ibutton";
import ErrorPage from "../ErrorPages/ErrorPage";
import EmptyState from "../../components/utilityComp/EmptyState";
import { BsPostcard } from "react-icons/bs";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDeviceSize = useDeviceSize("1023");
  const { fetchPostsFeed } = usePostsApis();
  const selectedTopic = searchParams.get("topic") || "All";
  const selectedFeed = searchParams.get("feed");
  const Icons = useIcons();
  const navigate = useNavigate();

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
  } = useInfiniteQuery({
    queryKey: ["postsFeed", selectedTopic, selectedFeed],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      fetchPostsFeed({
        pageParam,
        topic: selectedTopic,
        endpoint: selectedFeed,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length > 0
        ? lastPage[lastPage.length - 1]?.createdAt
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    0.1
  );

  if (isPostError) {
    const errorMessage = errorPosts?.data?.message;
    const statusCode = errorPosts?.status;
    return <ErrorPage message={errorMessage} statusCode={statusCode || 500} />;
  }

  const posts = postsData?.pages.flatMap((page) => page) || [];

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
  ];

  const renderPosts = () => {
    if (posts.length === 0 && !isLoading) {
      return (
        <div className="flex items-center justify-center flex-1 p-8">
          <EmptyState
            Icon={Icons["post"]}
            heading="No Posts Available"
            description="There are no posts found right now. Check back later for new recommendations."
          />
        </div>
      );
    }

    return posts.map((post, idx, arr) => {
      const isLastItem = idx === arr.length - 1;
      const shouldInsertWhoToFollow = idx === 3 && isDeviceSize;
      const itemKey = post?.id ? `post-${post.id}` : `post-idx-${idx}`;

      if (shouldInsertWhoToFollow) {
        return (
          <React.Fragment key={`fragment-${itemKey}`}>
            <WhoToFollow className="w-full spread-card p-5 text-sm my-4" />
            <PostPreview
              className="w-full my-4"
              ref={isLastItem ? lastItemRef : null}
              post={post}
            />
          </React.Fragment>
        );
      }

      return (
        <PostPreview
          className="w-full my-4"
          ref={isLastItem ? lastItemRef : null}
          key={itemKey}
          post={post}
        />
      );
    });
  };

  const renderLoadingSkeletons = () =>
    Array.from({ length: 6 }, (_, idx) => (
      <PostCardSkeleton key={`skeleton-${idx}`} />
    ));

  const renderListFooter = () => (
    <div className="flex items-center justify-center w-full py-8">
      {isFetchingNextPage && (
        <Spinner className="w-7 p-1 text-stone-900 dark:text-stone-100" />
      )}

      {!hasNextPage && !isFetchingNextPage && posts.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full spread-pill">
            <BsPostcard className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>You've seen all suggestions</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 min-w-0 max-w-7xl mx-auto w-full gap-6 px-3 sm:px-6 py-6 items-start border-inherit">
      {/* Main Feed Column */}
      <div className="flex flex-col flex-1 min-w-0 border-inherit">
        {/* Navigation Tabs Header */}
        <nav
          className="sticky top-0 z-10 w-full spread-card p-2 rounded-2xl mb-4 backdrop-blur-md"
          role="navigation"
          aria-label="Feed navigation"
        >
          <div className="flex items-center justify-start text-sm">
            <ul className="flex items-center gap-6 px-3 w-full">
              {navigationItems.map((item) => (
                <li key={item.id} className="flex items-center justify-center">
                  <Ibutton
                    action={item.onClick}
                    aria-label={item.ariaLabel}
                    id={item.id}
                    className={`capitalize font-bold text-xs sm:text-sm transition-all pb-1 ${
                      item.isActive
                        ? "text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100"
                        : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                    }`}
                  >
                    {item.label}
                  </Ibutton>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Selected Topic Tag Indicator */}
        {selectedTopic && selectedTopic !== "All" && (
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Filtered by topic: <strong className="text-stone-900 dark:text-stone-100">#{selectedTopic}</strong>
            </span>
            <button
              onClick={() => handleTopicClick("All")}
              className="text-xs text-stone-500 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Posts List */}
        <div className="w-full space-y-4 border-inherit">
          {isLoading ? renderLoadingSkeletons() : renderPosts()}
          {renderListFooter()}
        </div>
      </div>

      {/* Aside Topic Sidebar - Sticky on desktop */}
      {!isDeviceSize && (
        <Aside
          handleTopicClick={handleTopicClick}
          className="hidden lg:block w-80 lg:w-96 shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none spread-card p-5 text-xs rounded-2xl"
        />
      )}
    </div>
  );
}

export default Home;
