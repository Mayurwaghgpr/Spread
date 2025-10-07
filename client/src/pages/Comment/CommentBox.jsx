import React, { forwardRef, memo, useMemo, useRef, useState } from "react";
import userImageSrc from "../../utils/userImageSrc";
import { useInfiniteQuery, useMutation } from "react-query";

import PostsApis from "../../services/PostsApis";
import { useDispatch, useSelector } from "react-redux";
import { setCommentCred } from "../../store/slices/postSlice";
import { setToast } from "../../store/slices/uiSlice";
import { useOutletContext } from "react-router-dom";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import Menu from "../../component/Menus/Menu";
import useMenuConstant from "../../hooks/useMenuConstant";
import ProfileImage from "../../component/ProfileImage";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import AbbreviateNumber from "../../utils/AbbreviateNumber";
import Spinner from "../../component/loaders/Spinner";
import DOMPurify from "dompurify";
import useClickOutside from "../../hooks/useClickOutside";

const CommentBox = forwardRef(
  ({ comt, className, topCommentId, ...props }, ref) => {
    const [openReplies, setOpenReplies] = useState("");
    const [optimisticLike, setOptimisticLike] = useState("");

    const { user } = useSelector((state) => state.auth);
    const { commentCred, postViewData } = useSelector((state) => state.posts);
    const { hitLike, getReplies, deleteComtApi, pinComment } = PostsApis();
    const dispatch = useDispatch();

    const { COMMENT_MENU } = useMenuConstant(comt, "comment");
    const icons = useIcons();
    const menuRef = useRef(null);
    const { menuId, setMenuId } = useClickOutside(menuRef);

    // Memoized values
    const commenterImg = useMemo(
      () => userImageSrc(comt?.commenter),
      [comt?.commenter]
    );
    const isLiked = useMemo(
      () => comt?.commentLikes?.some((like) => like.likedBy === user.id),
      [comt?.commentLikes, user.id]
    );
    const isTopComment = useMemo(
      () => comt?.topCommentId === null,
      [comt?.topCommentId]
    );
    const isPostOwnerLiked = useMemo(
      () =>
        comt?.commentLikes?.find(
          (like) => like.likedBy === postViewData.user?.id
        ),
      [comt?.commentLikes, postViewData.user?.id]
    );

    const memoLike = useMemo(() => {
      if (optimisticLike === comt?.id && !isLiked) {
        return <AbbreviateNumber rawNumber={comt?.commentLikes?.length + 1} />;
      } else if (isLiked && optimisticLike === comt?.id) {
        return <AbbreviateNumber rawNumber={comt?.commentLikes?.length - 1} />;
      } else {
        return <AbbreviateNumber rawNumber={comt?.commentLikes?.length} />;
      }
    }, [optimisticLike, comt?.commentLikes?.length, comt?.id, isLiked]);

    // Mutations
    const { mutate: pinMutation } = useMutation({
      mutationFn: (data) => pinComment(data),
      onSuccess: (data) => {
        console.log({ data });
        comt.pind = data.pind;
        dispatch(setToast({ message: "Comment pinned!", type: "success" }));
        setOptimisticLike("");
      },
      onError: (error) => {
        setOptimisticLike("");
        dispatch(
          setToast({
            message: "Error occurred while pinning comment",
            type: "error",
          })
        );
      },
      onSettled: () => {
        setOptimisticLike("");
      },
    });

    const { mutate: likeMutation } = useMutation({
      mutationFn: (comtId) => hitLike(comtId),
      onSuccess: ({ message, updtCommentLikes }) => {
        comt.commentLikes = updtCommentLikes || [];
        dispatch(
          setToast({
            message: `${message} the comment!`,
            type: "success",
          })
        );
      },
      onError: (error) => {
        dispatch(
          setToast({
            message: "Error occurred while adding like",
            type: "error",
          })
        );
      },
      onSettled: () => {
        setOptimisticLike("");
      },
    });

    // Infinite query for replies
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isLoading,
      isFetchingNextPage,
    } = useInfiniteQuery(
      ["replies", comt?.id],
      ({ pageParam = 1 }) =>
        getReplies({
          postId: comt.postId,
          pageParam,
          topCommentId: comt?.id,
        }),
      {
        enabled: comt?.reply?.length > 0 && openReplies === comt?.id,
        getNextPageParam: (lastPage) =>
          lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
        refetchOnWindowFocus: false,
      }
    );

    // Event handlers
    const handleRepliesClick = () => {
      setOpenReplies((prev) => (prev === "" ? comt?.id : ""));
    };

    const handleLikeClick = () => {
      likeMutation(comt?.id);
      setOptimisticLike(comt?.id);
    };

    const handleReplyClick = () => {
      dispatch(
        setCommentCred({
          ...commentCred,
          topCommentId,
          replyTo: comt?.commenter?.id,
          at: comt?.commenter?.username,
        })
      );
    };

    const handlePinClick = () => {
      pinMutation({ pin: !comt.pind, commentId: comt.id });
    };

    const Comments = data?.pages.flatMap((page) => page.comments) || [];

    // Loading state
    if (!comt) {
      return (
        <div className={className}>
          <article className="flex flex-col w-full justify-center items-start gap-2 select-none">
            <div className="grid grid-cols-12 w-full gap-3">
              <div className="col-span-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full animate-pulse dark:bg-white bg-black bg-opacity-20 dark:bg-opacity-20" />
              <div className="col-start-3 col-span-full">
                <div className="w-1/4 my-2 h-4 rounded-full animate-pulse dark:bg-white bg-black bg-opacity-20 dark:bg-opacity-20" />
                <div className="w-full p-3 h-6 rounded-full animate-pulse dark:bg-white bg-black bg-opacity-20 dark:bg-opacity-20" />
              </div>
            </div>
          </article>
        </div>
      );
    }

    return (
      <div id={`#${comt.commenter?.id}`} ref={ref} className={className}>
        <article className=" group flex flex-col w-full justify-center items-start gap-2 select-none">
          <div className="grid grid-cols-12 w-full gap-3">
            <ProfileImage
              className={`flex justify-center items-center col-span-1 rounded-full ${
                isTopComment
                  ? "sm:w-10 sm:h-10 w-8 h-8"
                  : "sm:w-8 sm:h-8 w-6 h-6"
              }`}
              image={commenterImg?.userImageurl}
              alt={comt?.commenter?.username}
            />
            <div className="flex flex-col justify-center items-start col-start-3 col-span-full w-full">
              <div className="flex justify-between w-full items-center text-nowrap">
                <div className="flex justify-start items-center text-nowrap gap-2 text-sm">
                  <h1 className="font-semibold">{comt?.commenter?.username}</h1>
                  {comt.pind && icons["pin"]}
                  <FormatedTime
                    date={comt.createdAt}
                    className={`opacity-20 ${
                      comt.topCommentId === null ? "text-xs" : "text-[.6rem]"
                    }`}
                    formate={"dd/MMM/yyyy"}
                  />
                  {comt.commenter?.id === postViewData?.user?.id && (
                    <small className="opacity-20">author</small>
                  )}
                  {isPostOwnerLiked && (
                    <div className="flex justify-start items-center gap-2 text-xs/10">
                      {icons["heartFi"]}
                      <ProfileImage
                        className="w-5 h-5"
                        image={postViewData.user.userImage}
                      />
                    </div>
                  )}
                </div>
                <div className="hidden group-hover:block">
                  <Menu
                    className=" sm:absolute sm:top-5 right-0 sm:h-fit h-1/2 sm:p-1 p-6 z-10"
                    ref={menuRef}
                    menuId={menuId}
                    setMenuId={setMenuId}
                    items={COMMENT_MENU}
                    content={comt}
                  />
                </div>
              </div>
              <div className="break-words w-[75%]">
                <p
                  className="w-full text-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(comt.content || ""),
                  }}
                />
              </div>
              <div className="flex justify-start items-center gap-3 my-3">
                <Ibutton className="p-1 rounded-full" action={handleLikeClick}>
                  {(() => {
                    const showFilled =
                      (optimisticLike === comt.id && !isLiked) ||
                      (optimisticLike === "" && isLiked);
                    return showFilled ? icons["heartFi"] : icons["heartO"];
                  })()}
                  {memoLike}
                </Ibutton>
                <Ibutton className="p-1 rounded-full" action={handleReplyClick}>
                  Reply
                </Ibutton>
                {!comt.topCommentId && postViewData.user?.id === user?.id && (
                  <Ibutton className="opacity-30" action={handlePinClick}>
                    {icons["pin"]}
                  </Ibutton>
                )}
              </div>
            </div>
          </div>
          {!comt.topCommentId && (
            <Ibutton
              className="ml-12 flex justify-center items-center gap-2 px-1 text-blue-500 rounded-full"
              action={handleRepliesClick}
            >
              {openReplies !== comt.id ? icons["arrowDown"] : icons["arrowUp"]}
              Replies <AbbreviateNumber rawNumber={comt.reply?.length} />
              {isLoading && <Spinner className="w-3 h-3 bg-black p-0.5" />}
            </Ibutton>
          )}
        </article>
        {openReplies === comt.id && Comments?.length > 0 && (
          <>
            {Comments.map((reply) => (
              <CommentBox
                key={reply?.id}
                className="animate-fedin.2s ml-3 flex px-3 justify-center items-start gap-2 text-xs w-[90%]"
                comt={reply}
                topCommentId={comt.id}
              />
            ))}
            {hasNextPage && (
              <div className="w-full flex items-center gap-2 px-10">
                <hr className="bg-black h-0.5 w-1/12" />
                <button
                  className=""
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                      ? "View more..."
                      : ""}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

CommentBox.displayName = "CommentBox";

export default memo(CommentBox);
