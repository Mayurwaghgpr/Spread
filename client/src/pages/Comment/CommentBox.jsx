import React, { forwardRef, memo, useMemo, useState } from "react";
import userImageSrc from "../../utils/userImageSrc";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import abbreviateNumber from "../../utils/numAbrivation";
import { useInfiniteQuery, useMutation } from "react-query";

import PostsApis from "../../Apis/PostsApis";
import { useDispatch, useSelector } from "react-redux";
import { setCommentCred } from "../../redux/slices/postSlice";
import { TiPin } from "react-icons/ti";
import { setToast } from "../../redux/slices/uiSlice";
import { useOutletContext } from "react-router-dom";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import Menu from "../../component/postsComp/Menu";
import menuCosntant from "../../component/postsComp/menuCosntant";
import ProfileImage from "../../component/ProfileImage";

const CommentBox = forwardRef(
  ({ comt, className, topCommentId, commentPins = [] }, ref) => {
    const [openReplies, setOpenReplies] = useState("");
    const [optLike, setOptLike] = useState("");
    const { user } = useSelector((state) => state.auth);
    const { commentCred } = useSelector((state) => state.posts);
    const { hitLike, getReplies, deleteComtApi, pinComment } = PostsApis();
    const dispatch = useDispatch();
    const postdata = useOutletContext();
    const { MENU_ITEMS } = menuCosntant();

    const commenterImg = userImageSrc(comt?.commenter);
    const isLiked = comt?.commentLikes?.some(
      (like) => like.likedBy === user.id
    );

    const memoLike = useMemo(() => {
      if (optLike === comt?.id && !isLiked) {
        return abbreviateNumber(comt?.commentLikes?.length) + 1;
      } else if (isLiked && optLike === comt?.id) {
        return abbreviateNumber(comt?.commentLikes?.length) - 1;
      } else {
        return abbreviateNumber(comt?.commentLikes?.length);
      }
    }, [optLike, comt?.commentLikes?.length]);

    const { mutate: pinMutation } = useMutation({
      mutationFn: (data) => pinComment(data),
      onSuccess: (data) => {
        console.log({ data });
        comt.pind = data.pind;
        setOptLike("");
      },
      onError: (error) => {
        setOptLike("");
        dispatch(
          setToast({ message: "Error occured will adding like", type: "error" })
        );
      },
    });
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
      useInfiniteQuery(
        ["replies", comt?.id],
        ({ pageParam = 1 }) =>
          getReplies({
            postId: comt.postId,
            pageParam,
            topCommentId: comt?.id,
          }),
        {
          enabled: comt?.reply?.length > 0 && openReplies === comt?.id, // Only fetch when replies are open
          getNextPageParam: (lastPage) =>
            lastPage.meta.hasNextPage
              ? lastPage.meta.currentPage + 1
              : undefined,
          refetchOnWindowFocus: false,
        }
      );

    const { mutate: likeUnlikeMutation } = useMutation({
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

    const isPostOwnerLiked = useMemo(
      () =>
        comt?.commentLikes?.find((like) => like.likedBy === postdata.User.id),
      [comt?.commentLikes, postdata.User.id]
    );

    const handleRepliesClick = () => {
      setOpenReplies((prev) => (prev === "" ? comt.id : ""));
    };

    const Comments = data?.pages.flatMap((page) => page.comments) || [];
    const isTopComment = useMemo(() => comt?.topCommentId === null, [comt]);

    return (
      <div ref={ref} className={`${className}`}>
        <article className="p-2 flex flex-col  w-full justify-center items-start gap-2 select-none border-inherit">
          <div className=" flex  w-full justify-start gap-5 items-start border-inherit">
            <ProfileImage
              className={`flex min-w-fit min-h-fit  justify-center items-center rounded-full  ${
                isTopComment ? " w-10 h-10" : " w-6 h-6 "
              } `}
              image={commenterImg.userImageurl}
              alt={comt?.commenter?.username}
            />

            <div className="flex  flex-col justify-center items-start gap-2 w-full border-inherit">
              <div className="flex justify-between w-full items-center text-nowrap  text-sm border-inherit ">
                <div className="flex justify-start items-center text-nowrap gap-2 text-sm border-inherit">
                  <h1 className="font-semibold">{comt?.commenter?.username}</h1>
                  {/*pind comment */}
                  {comt?.pind && (
                    <TiPin className="text-black text-opacity-30 dark:text-opacity-20 dark:text-white" />
                  )}
                  {console.log(comt.topCommentId)}
                  <FormatedTime
                    date={comt?.createdAt}
                    className={` text-white ${comt.topCommentId === null ? "text-xs" : "text-[.6rem]"}`}
                    formate={"dd/MMM/yyyy"}
                  />
                  {comt?.commenter?.id === postdata?.User?.id && (
                    <small className=" text-black text-opacity-30 dark:text-opacity-20 dark:text-white">
                      author
                    </small>
                  )}
                  {/* if Post owner liked this post show the image of owner*/}
                  {isPostOwnerLiked && (
                    <div className="flex items-center justify-center gap-1 animate-fedin.2s">
                      <BsHeartFill className="text-red-500 text-[10px]" />{" "}
                      <div className=" w-5 h-5">
                        <img
                          className="w-full h-full object-cover object-top  rounded-full"
                          src={postdata.User.userImage}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Menu
                  className={
                    " sm:absolute sm:top-5 sm:w-40 w-full sm:h-fit h-1/2  mt-2 sm:p-1 p-6 "
                  }
                  items={[
                    (comt.commenter.id === user.id ||
                      postdata.authorId === user.id) &&
                      MENU_ITEMS.deleteComment,
                    comt.commenter.id === user.id && MENU_ITEMS.editComment,
                  ]}
                  content={comt}
                />
              </div>
              <div>
                <p>{comt.content}</p>
              </div>
              <div className="flex justify-start items-center gap-3 my-3">
                <button
                  onClick={() => {
                    likeUnlikeMutation(comt?.id);
                    setOptLike(comt?.id);
                  }}
                  className="flex justify-start min-w-8 items-center gap-1"
                >
                  {(optLike === comt?.id && !isLiked) ||
                  (optLike === "" && isLiked) ? (
                    <BsHeartFill className="text-red-500" />
                  ) : (
                    <BsHeart />
                  )}
                  {memoLike}
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
                {/* {(comt?.commenter?.id === user.id ||
                  postdata.User.id === user.id) && (
                  <button onClick={() => deletMutate(comt?.id)}>
                    <MdDelete />
                  </button>
                )} */}
                {!comt?.topCommentId && postdata.User.id === user.id && (
                  <button
                    onClick={() =>
                      pinMutation({ pin: !comt.pind, commentId: comt.id })
                    }
                    className="text-black text-opacity-30 dark:text-opacity-20 dark:text-white"
                  >
                    <TiPin />
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
                className="animate-fedin.2s ml-3 flex px-3 justify-center items-start gap-2 text-xs w-[90%]  "
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
  }
);

export default memo(CommentBox);
