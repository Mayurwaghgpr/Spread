import React, { forwardRef, memo, useMemo, useState } from "react";
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
import { TiPin, TiPinOutline } from "react-icons/ti";
import { setToast } from "../../redux/slices/uiSlice";
import { useOutletContext } from "react-router-dom";

const CommentBox = forwardRef(({ comt, className, topCommentId }, ref) => {
  const [openReplies, setOpenReplies] = useState("");
  const [optLike, setOptLike] = useState("");
  const { hitLike, getReplies, deleteComment } = PostsApis();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const commenterImg = userImageSrc(comt?.commenter);
  const postdata = useOutletContext();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(
      ["replies", comt?.id],
      ({ pageParam = 1 }) =>
        getReplies({ postId: comt.postId, pageParam, topCommentId: comt?.id }),
      {
        enabled: comt?.reply?.length > 0 && openReplies === comt?.id, // Only fetch when replies are open
        getNextPageParam: (lastPage) =>
          lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: likeMutate } = useMutation({
    mutationFn: (comtId) => hitLike(comtId),
    onSuccess: ({ updtCommentLikes }) => {
      comt.commentLikes = updtCommentLikes || [];
      setOptLike("");
    },
    onError: (error) => {
      setOptLike("");
      dispatch(
        setToast({ message: "Error occured will adding like", type: "error" })
      );
    },
  });

  const { mutate: deletMutate } = useMutation({
    mutationFn: (comtId) => deleteComment(comtId),
    onSuccess: (data) => {
      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const isLiked = useMemo(
    () => comt?.commentLikes?.find((like) => like.likedBy === user?.id),
    [comt?.commentLikes, user?.id]
  );
  const isPostOwnerLiked = useMemo(
    () => comt?.commentLikes?.find((like) => like.likedBy === postdata.User.id),
    [comt?.commentLikes, postdata.User.id]
  );
  const handleRepliesClick = () => {
    setOpenReplies((prev) => (prev === "" ? comt.id : ""));
  };
  const Comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div ref={ref} className={`${className}`}>
      <article className="p-2 flex flex-col  w-full justify-center items-start gap-2 select-none">
        <div className=" flex  w-full justify-start gap-5 items-start">
          <div
            className={`flex justify-center items-center rounded-full  ${
              comt?.topCommentId ? "size-8 " : "w-10 h-10"
            }`}
          >
            <img
              className={"w-full h-full object-cover object-top rounded-full"}
              src={commenterImg.userImageurl}
              alt={comt?.commenter?.username}
            />
          </div>
          <div>
            <div className="flex justify-start items-center text-nowrap gap-3 text-sm">
              <h1 className="font-semibold">{comt?.commenter?.username}</h1>
              {comt?.pind && <TiPin />} {/*pind comment */}
              <span className="text-xs text-black text-opacity-30 dark:text-opacity-20 dark:text-white">
                {formatDate(new Date(comt?.createdAt), "d MMM yyy")}
              </span>
              {/* if Post owner liked this post show the image of owner*/}
              {isPostOwnerLiked && (
                <div className="flex items-center justify-center gap-1 animate-fedin.2s">
                  <BsHeartFill className="text-red-500 text-[10px]" />{" "}
                  <div className=" w-5 h-5">
                    <img
                      className="w-full h-full object-cover object-top  rounded-full"
                      src={postdata.User.userImage}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <p>{comt.content}</p>
            </div>
            <div className="flex justify-start items-center gap-3 my-3">
              <button
                onClick={() => {
                  likeMutate(comt?.id);
                  setOptLike(comt?.id);
                }}
                className="flex justify-start min-w-8 items-center gap-1"
              >
                {isLiked || (optLike === comt?.id && !isLiked) ? (
                  <BsHeartFill className="text-red-500" />
                ) : (
                  <BsHeart />
                )}
                {optLike === comt?.id && !isLiked
                  ? abbreviateNumber(comt?.commentLikes?.length) + 1
                  : abbreviateNumber(comt?.commentLikes?.length)}
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
              {(comt?.commenter?.id === user.id ||
                postdata.User.id === user.id) && (
                <button onClick={() => deletMutate(comt?.id)}>
                  <MdDelete />
                </button>
              )}
            </div>
          </div>
        </div>
        {!comt?.topCommentId && (
          <button
            onClick={handleRepliesClick}
            className="flex justify-start items-center gap-3 px-10  text-blue-400"
          >
            {openReplies !== comt.id ? <IoIosArrowDown /> : <IoIosArrowUp />}{" "}
            Replies {abbreviateNumber(comt?.reply?.length)}
          </button>
        )}
      </article>
      {openReplies === comt.id && Comments?.length > 0 && (
        <>
          {Comments.map((reply) => (
            <CommentBox
              key={reply?.id}
              className="animate-fedin.2s ml-3 flex px-3 justify-center items-start gap-2 text-xs  "
              comt={reply}
              topCommentId={comt?.id} //this id should be always set to the top most commentId in post comment section
            />
          ))}
          {hasNextPage && (
            <div className="w-full flex items-center gap-2 px-10">
              {" "}
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
                    : " "}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default memo(CommentBox);
