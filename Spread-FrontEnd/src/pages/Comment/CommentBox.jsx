import React, { memo, useMemo, useState } from "react";
import userImageSrc from "../../utils/userImageSrc";
import { formatDate } from "date-fns";
import { BsArrowDown, BsArrowUp, BsHeart, BsHeartFill } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import abbreviateNumber from "../../utils/numAbrivation";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import PostsApis from "../../Apis/PostsApis";
import { useDispatch, useSelector } from "react-redux";
import { setCommentCred } from "../../redux/slices/postSlice";
import { MdDelete } from "react-icons/md";
import { setToast } from "../../redux/slices/uiSlice";

function CommentBox({ comt, className, topCommentId }) {
  const [openReplies, setOpenReplies] = useState("");
  const { hitLike, getReplies, deleteComment } = PostsApis();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const commenterImg = userImageSrc(comt?.commenter);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(
      ["replies", comt?.id],
      ({ pageParam = 1 }) =>
        getReplies({ postId: comt.postId, pageParam, topCommentId: comt?.id }),
      {
        // enabled: openReplies === comt?.id, // Only fetch when replies are open
        getNextPageParam: (lastPage) =>
          lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: likeMutate } = useMutation({
    mutationFn: (comtId) => hitLike(comtId),
    onSuccess: ({ updtCommentLikes }) => {
      comt.commentLikes = updtCommentLikes || [];
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { mutate: deletMutate } = useMutation({
    mutationFn: (comtId) => deleteComment(comtId),
    onSuccess: (data) => {
      console.log(data);
      dispatch(setToast({ message: data.message, type: "success" }));
      queryClient.invalidateQueries(["replies"]);
      queryClient.invalidateQueries(["TopComments"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const isLiked = useMemo(
    () => comt?.commentLikes?.find((like) => like.likedBy === user?.id),
    [comt?.commentLikes, user?.id]
  );

  // const handleRepliesClick = () => {
  //   setOpenReplies((prev) => (prev === "" ? comt.id : ""));
  // };
  const Comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div className={`${className}`}>
      <article className="p-2 flex select-none w-full justify-start items-start gap-2">
        <div className="w-fit h-fit px-3">
          <img
            className={`max-w-11 max-h-10 rounded-full ${
              comt?.topCommentId && "size-8"
            }`}
            src={commenterImg.userImageurl}
            alt={comt?.commenter?.username}
          />
        </div>
        <div>
          <div className="flex justify-start items-center text-nowrap gap-3 text-sm">
            <h1>{comt?.commenter?.username}</h1>
            <span className="text-xs dark:text-opacity-20 dark:text-white">
              {formatDate(new Date(comt?.createdAt), "d MMM yyy")}
            </span>
          </div>
          <div>
            <p>{comt.content}</p>
          </div>
          <div className="flex justify-start items-center gap-3 my-3">
            <button
              onClick={() => likeMutate(comt?.id)}
              className="flex justify-start min-w-8 items-center gap-1"
            >
              {isLiked ? <BsHeartFill /> : <BsHeart />}
              {abbreviateNumber(comt?.commentLikes?.length)}
            </button>
            <button
              onClick={() =>
                dispatch(
                  setCommentCred({
                    ...commentCred,
                    topCommentId, // Top most comment Id in post comment section
                    replyTo: comt?.commenter.id, //Id or refrence of the comment user going to reply
                    at: "@" + comt?.commenter?.username,
                  })
                )
              }
            >
              Reply
            </button>
            {comt?.commenter?.id === user.id && (
              <button onClick={() => deletMutate(comt?.id)}>
                <MdDelete />
              </button>
            )}
          </div>
        </div>
        {/* {!comt?.topCommentId && (
          <button
            onClick={handleRepliesClick}
            className="flex justify-start items-center gap-3 text-blue-400"
          >
            {openReplies !== comt.id ? <IoIosArrowDown /> : <IoIosArrowUp />}{" "}
            Replies {abbreviateNumber(comt?.reply?.length)}
          </button>
        )} */}
      </article>
      {Comments?.length > 0 && (
        <>
          {Comments.length > 0 &&
            Comments.map((reply) => (
              <CommentBox
                key={reply?.id}
                className="animate-fedin.2s ml-3 flex px-3 justify-center items-start gap-2 text-xs  "
                comt={reply}
                topCommentId={comt?.id} //this id should be always set to the top most commentId in post comment section
              />
            ))}
          {hasNextPage && (
            <button
              className="px-10"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "View more..."
                  : " "}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default memo(CommentBox);
