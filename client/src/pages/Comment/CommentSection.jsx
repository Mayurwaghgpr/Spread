import { memo, useCallback, useMemo } from "react";
import { lazy } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import PostsApis from "../../services/usePostsApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import Spinner from "../../components/loaders/Spinner";
import { setCommentCred } from "../../store/slices/postSlice";
import { useNavigate } from "react-router-dom";
import CommentBox from "./CommentBox";
import EmptyState from "../../components/utilityComp/EmptyState";
import { X, MessageSquare, AlertCircle } from "lucide-react";

const CommentInput = lazy(() => import("./CommentInput"));

const LOADING_SKELETON_COUNT = 6;

function CommentSection() {
  const { isLogin } = useSelector((state) => state.auth);
  const { commentCred, postViewData } = useSelector((state) => state.posts);
  const { getComments } = PostsApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetCommentCred = useMemo(
    () => ({
      ...commentCred,
      topCommentId: null,
      at: "",
      content: "",
      replyTo: null,
    }),
    [commentCred]
  );

  const {
    data: TopComments,
    error: errorPosts,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["TopComments", postViewData?.id],
    queryFn: ({ pageParam = 1 }) => getComments({ postId: postViewData?.id, pageParam }),
    enabled: !!postViewData?.id,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    0.1
  );

  const comments = useMemo(
    () => TopComments?.pages?.flatMap((page) => page.comments) || [],
    [TopComments]
  );

  const commentPins = useMemo(
    () => comments.filter((comment) => comment.pind),
    [comments]
  );

  const handleCloseModal = useCallback(() => {
    navigate(-1, { replace: true });
    dispatch(setCommentCred(resetCommentCred));
  }, [navigate, dispatch, resetCommentCred]);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const renderErrorState = useCallback(() => {
    if (!errorPosts) return null;

    return (
      <div className="flex flex-col items-center gap-2 text-center py-8 px-4">
        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
          Failed to load comments
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Please check your connection and try again.
        </p>
      </div>
    );
  }, [errorPosts]);

  return (
    <div
      onClick={handleCloseModal}
      className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-black/50 backdrop-blur-sm p-3 sm:p-6 transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-label="Comments modal"
    >
      <div
        onClick={handleModalClick}
        className="flex flex-col w-full max-w-md h-[88vh] sm:h-[92vh] spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5 sm:slide-in-from-right-5"
      >
        {/* Header */}
        <header className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100">
              <MessageSquare className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                Responses
              </h1>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                {comments.length} comments
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            aria-label="Close comments"
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Comments List Main Body */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {(isLoading
            ? Array(LOADING_SKELETON_COUNT).fill(null)
            : comments
          ).map((comment, idx) => {
            const shouldAttachRef = idx === comments.length - 1 && hasNextPage;

            return (
              <CommentBox
                ref={shouldAttachRef ? lastItemRef : null}
                key={comment?.id || `skeleton-${idx}`}
                comt={comment || null}
                commentPins={commentPins || []}
                topCommentId={comment?.id || null}
              />
            );
          })}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <Spinner className="w-5 h-5 text-stone-900 dark:text-stone-100" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isFetching && !errorPosts && comments.length === 0 && (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <EmptyState
                Icon={MessageSquare}
                heading="No comments yet"
                description={
                  isLogin
                    ? "Be the first to share your thoughts and start the conversation!"
                    : "Sign in to join the conversation and share your thoughts."
                }
              />
            </div>
          )}

          {renderErrorState()}
        </main>

        {/* Comment Input Footer */}
        <footer className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 backdrop-blur-md">
          <CommentInput />
        </footer>
      </div>
    </div>
  );
}

export default memo(CommentSection);
