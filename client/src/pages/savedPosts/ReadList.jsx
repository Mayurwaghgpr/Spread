import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import PostPreview from "../../components/postsComp/PostPreview";
import Spinner from "../../components/loaders/Spinner";
import PostCardSkeleton from "../../components/loaders/PostCardSkeleton";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import useProfileApi from "../../services/useProfileApis";
import usePostsApis from "../../services/usePostsApis";
import { useParams, useNavigate } from "react-router-dom";
import { BookmarkCheck, Folder } from "lucide-react";
import EmptyState from "../../components/utilityComp/EmptyState";

const ReadList = () => {
  const { getArchivedPosts } = useProfileApi();
  const { fetchSavedPostsGroup } = usePostsApis();
  const { group } = useParams();
  const navigate = useNavigate();

  // Fetch Saved Post Groups
  const { data: groupsData } = useQuery({
    queryKey: ["SavedPostGroups"],
    queryFn: fetchSavedPostsGroup,
  });

  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["saved_posts", group || "all"],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      getArchivedPosts({ pageParam, group }),
    getNextPageParam: (lastPage) => {
      return lastPage.length !== 0
        ? lastPage[lastPage.length - 1]?.createdAt
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page) || [],
    [data?.pages]
  );

  const activeGroup = group || "All";

  return (
    <div className="flex flex-col items-center w-full min-h-screen border-inherit px-3 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Hero Header Section */}
      <div className="w-full spread-card p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 border border-stone-300/50 dark:border-stone-700/50 shrink-0">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Reading List
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Access your saved stories and custom organized folders
            </p>
          </div>
        </div>

        {/* Folder Filter Tabs */}
        {groupsData?.groups && groupsData.groups.length > 0 && (
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => navigate("/bookmarks")}
              className={`spread-pill text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${
                activeGroup === "All"
                  ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold"
                  : "text-stone-700 dark:text-stone-300"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              All Saved
            </button>

            {groupsData.groups.map((item) => (
              <button
                key={item?.groupName}
                onClick={() => navigate(`/bookmarks/${item?.groupName}`)}
                className={`spread-pill text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${
                  activeGroup === item?.groupName
                    ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                #{item?.groupName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Posts Feed List */}
      <div className="w-full space-y-4 border-inherit">
        {isLoading ? (
          Array.from({ length: 4 }, (_, idx) => (
            <PostCardSkeleton key={`saved-skeleton-${idx}`} />
          ))
        ) : posts.length === 0 ? (
          <div className="spread-card p-10 rounded-2xl flex flex-col items-center justify-center text-center my-4">
            <EmptyState
              Icon={BookmarkCheck}
              heading={
                activeGroup === "All"
                  ? "No Saved Posts Yet"
                  : `No Posts in #${activeGroup}`
              }
              description="Posts you bookmark or save to folders will appear here for easy reading."
            />
            <button
              onClick={() => navigate("/")}
              className="spread-btn-primary text-xs font-semibold px-5 py-2 mt-4 hover:scale-105 transition-transform"
            >
              Explore Feed
            </button>
          </div>
        ) : (
          posts.map((post, idx) => {
            const isLastItem = idx === posts.length - 1;
            return (
              <PostPreview
                className="w-full"
                ref={isLastItem ? lastItemRef : null}
                key={post?.id || `saved-${idx}`}
                post={post}
                Saved={true}
              />
            );
          })
        )}

        {/* Loading Footer */}
        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center py-6">
            <Spinner className="w-7 h-7 text-stone-900 dark:text-stone-100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadList;
