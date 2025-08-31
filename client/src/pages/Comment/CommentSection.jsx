import React, { memo, useCallback, useMemo } from "react";
import { lazy } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import PostsApis from "../../services/PostsApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import Spinner from "../../component/loaders/Spinner";
import { setCommentCred } from "../../store/slices/postSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import CommentBox from "./CommentBox";

const CommentInput = lazy(() => import("./CommentInput"));

const LOADING_SKELETON_COUNT = 20;

function CommentSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { getComments } = PostsApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const icons = useIcons();

  const { postData } = useOutletContext();

  // Memoize the reset comment credentials object
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

  // Comments infinite query
  const {
    data: TopComments,
    error: errorPosts,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["TopComments", postData?.id],
    ({ pageParam = 1 }) => getComments({ postId: postData?.id, pageParam }),
    {
      enabled: !!postData?.id,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Observer for infinite scroll
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  // Memoized comments data
  const comments = useMemo(
    () => TopComments?.pages?.flatMap((page) => page.comments) || [],
    [TopComments]
  );

  const commentPins = useMemo(
    () => comments.filter((comment) => comment.pind),
    [comments]
  );

  // Event handlers
  const handleCloseModal = useCallback(() => {
    navigate(-1, { replace: true });
    dispatch(setCommentCred(resetCommentCred));
  }, [navigate, dispatch, resetCommentCred]);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Render loading skeletons
  const renderLoadingSkeletons = useCallback(() => {
    return Array(LOADING_SKELETON_COUNT)
      .fill(null)
      .map((_, idx) => (
        <CommentBox
          key={`skeleton-${idx}`}
          className="animate-pulse flex flex-col text-sm justify-center w-full items-start gap-3 border-inherit p-1"
          comt={null}
          commentPins={[]}
          topCommentId={null}
        />
      ));
  }, []);

  // Render comments
  const renderComments = useCallback(() => {
    return comments.map((comment, idx) => {
      const shouldAttachRef = idx === comments.length - 1 && hasNextPage;

      return (
        <CommentBox
          ref={shouldAttachRef ? lastItemRef : null}
          className="flex flex-col text-sm justify-center w-full items-start gap-3 border-inherit p-1 transition-all duration-300 ease-out hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-lg"
          key={comment.id}
          comt={comment}
          commentPins={commentPins}
          topCommentId={comment.id}
        />
      );
    });
  }, [comments, commentPins, hasNextPage, lastItemRef]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (isFetching || comments.length > 0) return null;

    return (
      <div className="flex flex-col justify-center items-center gap-4 h-full text-center max-w-sm mx-auto py-12">
        <div className="w-16 h-16 text-2xl rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
          {icons["messageDoted"]}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          No comments yet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {isLogin
            ? "Be the first to share your thoughts and start the conversation!"
            : "Sign in to join the conversation and share your thoughts."}
        </p>
      </div>
    );
  }, [isFetching, comments.length, isLogin]);

  // Render error state
  const renderErrorState = useCallback(() => {
    if (!errorPosts) return null;

    return (
      <div className="flex flex-col items-center gap-3 text-center py-8 px-4">
        <div className="w-12 h-12 text-2xl rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          {icons["error"]}
        </div>
        <h3 className="text-base font-medium text-red-700 dark:text-red-400">
          Failed to load comments
        </h3>
        <p className="text-sm text-red-600 dark:text-red-500">
          Please check your connection and try again.
        </p>
      </div>
    );
  }, [errorPosts]);

  return (
    <section
      onClick={handleCloseModal}
      className="flex justify-end items-end lg:sticky lg:top-0 fixed top-0 right-0 left-0 w-fit animate-fedin.2s lg:h- h-full sm:z-0 z-30 pb-16 pt-5"
      role="dialog"
      aria-label="Comments modal"
    >
      <div
        onClick={handleModalClick}
        className="relative flex flex-col gap-0 max-w-[30rem] w-full sm:h-full h-[60%] border border-gray-200 dark:border-gray-700 sm:m-0 rounded-2xl m-1  bg-light dark:bg-dark backdrop-blur-xl sm:animate-none animate-slide-in-bottom overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-inherit backdrop-blur-sm">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
            Comments
          </h1>
          <Ibutton
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            action={handleCloseModal}
            aria-label="Close comments"
          >
            {icons["close"]}
          </Ibutton>
        </header>

        {/* Comments List */}
        <main className="flex flex-col justify-start items-center gap-6 pb-12 pt-6 px-6 w-full h-[80%] overflow-y-auto border-inherit scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {isLoading ? renderLoadingSkeletons() : renderComments()}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4 h-20">
              <Spinner className="w-6 h-6 bg-gray-600 dark:bg-gray-300" />
            </div>
          )}

          {/* Empty state */}
          {renderEmptyState()}

          {/* Error state */}
          {renderErrorState()}
        </main>

        {/* Comment Input */}
        <footer className="border-t border-gray-200 dark:border-gray-700 border-inherit">
          <CommentInput className="flex justify-center items-start gap-5 w-full p-6 z-10  backdrop-blur-sm animate-slide-in-top border-inherit" />
        </footer>
      </div>
    </section>
  );
}

export default memo(CommentSection);
