import { forwardRef, memo, useMemo, useRef, useState } from "react";
import userImageSrc from "../../utils/functions/userImageSrc";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import PostsApis from "../../services/usePostsApis";
import { useDispatch, useSelector } from "react-redux";
import { setCommentCred } from "../../store/slices/postSlice";
import { setToast } from "../../store/slices/uiSlice";
import FormatedTime from "../../components/utilityComp/FormatedTime";
import Menu from "../../components/menus/Menu";
import useMenuConstant from "../../hooks/useMenuConstant";
import ProfileImage from "../../components/ProfileImage";
import AbbreviateNumber from "../../utils/components/AbbreviateNumber";
import Spinner from "../../components/loaders/Spinner";
import DOMPurify from "dompurify";
import useClickOutside from "../../hooks/useClickOutside";
import { Heart, Reply, Pin, ChevronDown, ChevronUp } from "lucide-react";

const CommentBox = forwardRef(
  ({ comt, className = "", topCommentId, ...props }, ref) => {
    const [openReplies, setOpenReplies] = useState("");
    const [optimisticLike, setOptimisticLike] = useState("");

    const { user } = useSelector((state) => state.auth);
    const { commentCred, postViewData } = useSelector((state) => state.posts);
    const { hitLike, getReplies, pinComment } = PostsApis();
    const dispatch = useDispatch();

    const { COMMENT_MENU } = useMenuConstant(comt, "comment");
    const menuRef = useRef(null);
    const { menuId, setMenuId } = useClickOutside(menuRef);

    const commenterImg = useMemo(
      () => userImageSrc(comt?.commenter),
      [comt?.commenter]
    );

    const isLiked = useMemo(
      () => comt?.commentLikes?.some((like) => like.likedBy === user?.id),
      [comt?.commentLikes, user?.id]
    );

    const isTopComment = useMemo(
      () => comt?.topCommentId === null,
      [comt?.topCommentId]
    );

    const isAuthor = useMemo(
      () => comt?.commenter?.id === postViewData?.author?.id,
      [comt?.commenter?.id, postViewData?.author?.id]
    );

    const likeCount = useMemo(() => {
      const baseCount = comt?.commentLikes?.length || 0;
      if (optimisticLike === comt?.id && !isLiked) {
        return baseCount + 1;
      } else if (isLiked && optimisticLike === comt?.id) {
        return Math.max(0, baseCount - 1);
      }
      return baseCount;
    }, [optimisticLike, comt?.commentLikes?.length, comt?.id, isLiked]);

    const { mutate: pinMutation } = useMutation({
      mutationFn: (data) => pinComment(data),
      onSuccess: (data) => {
        comt.pind = data.pind;
        dispatch(setToast({ message: "Comment pinned!", type: "success" }));
        setOptimisticLike("");
      },
      onError: () => {
        setOptimisticLike("");
        dispatch(setToast({ message: "Error pinning comment", type: "error" }));
      },
      onSettled: () => setOptimisticLike(""),
    });

    const { mutate: likeMutation } = useMutation({
      mutationFn: (comtId) => hitLike(comtId),
      onSuccess: ({ message, updtCommentLikes }) => {
        comt.commentLikes = updtCommentLikes || [];
      },
      onError: () => {
        dispatch(setToast({ message: "Error adding like", type: "error" }));
      },
      onSettled: () => setOptimisticLike(""),
    });

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
      useInfiniteQuery({
        queryKey: ["replies", comt?.id],
        queryFn: ({ pageParam = 1 }) =>
          getReplies({
            postId: comt.postId,
            pageParam,
            topCommentId: comt?.id,
          }),
        enabled: comt?.replies?.length > 0 && openReplies === comt?.id,
        getNextPageParam: (lastPage) =>
          lastPage.meta.hasNextPage
            ? lastPage.meta.currentPage + 1
            : undefined,
        refetchOnWindowFocus: false,
      });

    const handleRepliesClick = () => {
      setOpenReplies((prev) => (prev === "" ? comt?.id : ""));
    };

    const handleLikeClick = () => {
      setOptimisticLike(comt?.id);
      likeMutation(comt?.id);
    };

    const handleReplyClick = () => {
      dispatch(
        setCommentCred({
          ...commentCred,
          topCommentId: topCommentId || comt?.id,
          replyTo: comt?.commenter?.id,
          at: comt?.commenter?.username,
        })
      );
    };

    const handlePinClick = () => {
      pinMutation({ pin: !comt.pind, commentId: comt.id });
    };

    const replies = data?.pages.flatMap((page) => page.replies) || [];

    if (!comt) {
      return (
        <div className="w-full p-2 animate-pulse flex items-start gap-3 border-b border-stone-200 dark:border-stone-800">
          <div className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-3 bg-stone-300 dark:bg-stone-700 rounded-full" />
            <div className="w-full h-3.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
          </div>
        </div>
      );
    }

    const showHeartFilled =
      (optimisticLike === comt.id && !isLiked) ||
      (optimisticLike === "" && isLiked);

    return (
      <div id={`#${comt.commenter?.id}`} ref={ref} className={`w-full border-b border-stone-200/70 dark:border-stone-800/70 pb-3.5 mb-2 ${className}`}>
        <article className="group relative flex flex-col w-full hover:bg-stone-200/30 dark:hover:bg-stone-800/20 p-2.5 rounded-xl transition-colors space-y-1.5">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <ProfileImage
                className={`rounded-full ring-1 ring-stone-300 dark:ring-stone-700 shrink-0 ${
                  isTopComment ? "w-8 h-8" : "w-7 h-7"
                }`}
                image={commenterImg?.userImageurl}
                alt={comt?.commenter?.username}
              />
              <div className="flex items-center gap-2 text-xs truncate">
                <span className="font-bold text-stone-900 dark:text-stone-100 truncate">
                  {comt?.commenter?.displayName || comt?.commenter?.username}
                </span>

                {isAuthor && (
                  <span className="spread-pill text-[10px] px-2 py-0.5 font-bold text-stone-700 dark:text-stone-300">
                    Author
                  </span>
                )}

                {comt.pind && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-stone-600 dark:text-stone-400">
                    <Pin className="w-3 h-3 fill-stone-600 dark:fill-stone-400" />
                    Pinned
                  </span>
                )}

                <FormatedTime
                  date={comt.createdAt}
                  className="text-[11px] text-stone-400 font-normal"
                />
              </div>
            </div>

            <Menu
              ref={menuRef}
              menuId={menuId}
              setMenuId={setMenuId}
              items={COMMENT_MENU}
              content={comt}
            />
          </div>

          {/* Comment Body */}
          <div className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed pl-10">
            <p
              className="whitespace-pre-line break-words"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(comt.content || ""),
              }}
            />
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-4 pl-10 pt-1 text-xs text-stone-500 dark:text-stone-400">
            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 font-semibold hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer ${
                showHeartFilled ? "text-rose-500" : ""
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  showHeartFilled ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
              <AbbreviateNumber rawNumber={likeCount} />
            </button>

            <button
              type="button"
              onClick={handleReplyClick}
              className="flex items-center gap-1 font-semibold hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>

            {!comt.topCommentId && postViewData?.author?.id === user?.id && (
              <button
                type="button"
                onClick={handlePinClick}
                className="flex items-center gap-1 font-semibold hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
                title="Pin comment"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Thread Replies Button */}
          {!comt.topCommentId && comt.replies?.length > 0 && (
            <div className="pl-10 pt-1">
              <button
                type="button"
                onClick={handleRepliesClick}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:underline cursor-pointer"
              >
                {openReplies !== comt.id ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
                <span>
                  {comt.replies.length} {comt.replies.length === 1 ? "reply" : "replies"}
                </span>
                {isLoading && <Spinner className="w-3 h-3 text-stone-900 dark:text-stone-100" />}
              </button>
            </div>
          )}
        </article>

        {/* Nested Replies List */}
        {openReplies === comt.id && replies?.length > 0 && (
          <div className="border-l-2 border-stone-200 dark:border-stone-800 ml-4 pl-3 mt-2 space-y-2">
            {replies.map((reply) => (
              <CommentBox
                key={reply?.id}
                comt={reply}
                topCommentId={comt.id}
              />
            ))}
            {hasNextPage && (
              <div className="pt-2 pl-2">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer"
                >
                  {isFetchingNextPage ? "Loading replies..." : "View more replies"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

CommentBox.displayName = "CommentBox";

export default memo(CommentBox);
