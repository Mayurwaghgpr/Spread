import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import PostPreview from "../../components/postsComp/PostPreview";
import Spinner from "../../components/loaders/Spinner";
import PostCardSkeleton from "../../components/loaders/PostCardSkeleton";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import useProfileApi from "../../services/useProfileApis";
import usePostsApis from "../../services/usePostsApis";
import { useParams, useNavigate } from "react-router-dom";
import useIcons from "../../hooks/useIcons";
import EmptyState from "../../components/utilityComp/EmptyState";

const ReadList = () => {
  const icons = useIcons();
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["readList", group],
    queryFn: ({ pageParam = 1 }) =>
      getArchivedPosts({ page: pageParam, group: group !== "All" ? group : undefined }),
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
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
          <div className="p-3 rounded-2xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 border border-stone-300/50 dark:border-stone-700/50 shrink-0 text-xl">
            {icons.bookmarkFi}
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
              <span className="text-xs">{icons.folder}</span>
              All Saved
            </button>

            {groupsData.groups.map((grp) => (
              <button
                key={grp.groupName}
                onClick={() => navigate(`/bookmarks/${grp.groupName}`)}
                className={`spread-pill text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${
                  activeGroup === grp.groupName
                    ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                <span className="text-xs">{icons.folder}</span>
                #{grp.groupName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content List */}
      <div className="w-full space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, idx) => (
            <PostCardSkeleton key={`saved-skeleton-${idx}`} />
          ))
        ) : posts.length === 0 ? (
          <div className="spread-card p-10 rounded-2xl flex flex-col items-center justify-center text-center my-4">
            <EmptyState
              Icon={icons.bookmarkFi}
              heading={
                activeGroup === "All"
                  ? "No Saved Posts Yet"
                  : `No Posts in #${activeGroup}`
              }
              description="Posts you bookmark or save to folders will appear here for easy reading."
            />
            <button
              onClick={() => navigate("/")}
              className="mt-4 spread-btn-primary text-xs px-5 py-2 rounded-full font-bold cursor-pointer"
            >
              Explore Feed
            </button>
          </div>
        ) : (
          posts.map((post, idx) => (
            <PostPreview
              ref={idx === posts.length - 1 ? lastItemRef : null}
              key={post.id || `saved-post-${idx}`}
              post={post}
            />
          ))
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <Spinner className="w-6 h-6 text-stone-900 dark:text-stone-100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadList;
