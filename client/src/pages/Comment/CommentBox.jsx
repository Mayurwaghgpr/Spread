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
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";

const CommentBox = forwardRef(({ comt, className, topCommentId }, ref) => {
  const [openReplies, setOpenReplies] = useState("");
  const [optLike, setOptLike] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { hitLike, getReplies, deleteComtApi, pinComment } = PostsApis();
  const dispatch = useDispatch();
  const postdata = useOutletContext();
  const { MENU_ITEMS } = menuCosntant();
  const icons = useIcons();

  const commenterImg = userImageSrc(comt?.commenter);
  const isLiked = comt?.commentLikes?.some((like) => like.likedBy === user.id);

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
      dispatch(
        setToast({ message: "Comment pinned successfully!", type: "success" })
      );

      setOptLike("");
    },
    onError: (error) => {
      setOptLike("");
      dispatch(
        setToast({
          message: "Error occurred while pinning comment",
          type: "error",
        })
      );
    },
    refetchOnWindowFocus: false,
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
          lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: likeUnlikeMutation } = useMutation({
    mutationFn: (comtId) => hitLike(comtId),
    onSuccess: ({ updtCommentLikes }) => {
      comt.commentLikes = updtCommentLikes || [];
      setOptLike("");
      dispatch(
        setToast({
          message: "Liked the comment successfully!",
          type: "success",
        })
      );
    },
    onError: (error) => {
      setOptLike("");
      dispatch(
        setToast({ message: "Error occurred while adding like", type: "error" })
      );
    },
    refetchOnWindowFocus: false,
  });

  const isPostOwnerLiked = useMemo(
    () => comt?.commentLikes?.find((like) => like.likedBy === postdata.User.id),
    [comt?.commentLikes, postdata.User.id]
  );

  const handleRepliesClick = () => {
    setOpenReplies((prev) => (prev === "" ? comt.id : ""));
  };

  const Comments = data?.pages.flatMap((page) => page.comments) || [];
  const isTopComment = useMemo(() => comt?.topCommentId === null, [comt]);

  return (
    <div ref={ref} className={`${className}`}>
      <article className=" flex flex-col  w-full justify-center items-start gap-2 select-none border-inherit">
        <div className=" grid grid-cols-12 border-inherit w-full">
          <ProfileImage
            className={`flex justify-center items-center col-span-1  rounded-full  ${
              isTopComment ? " w-10 h-10" : " w-8 h-8 "
            } `}
            image={commenterImg.userImageurl}
            alt={comt?.commenter?.username}
          />
          <div className="flex flex-col justify-center items-start gap-1 col-start-3 col-span-full w-full border-inherit">
            <div className="flex justify-between w-full items-center text-nowrap  text-sm border-inherit ">
              <div className="flex justify-start items-center text-nowrap gap-2 text-sm border-inherit">
                <h1 className="font-semibold">{comt?.commenter?.username}</h1>
                {/*pind comment */}
                {comt?.pind && icons["pin"]}
                <FormatedTime
                  date={comt?.createdAt}
                  className={` opacity-20 ${comt.topCommentId === null ? "text-xs" : "text-[.6rem]"}`}
                  formate={"dd/MMM/yyyy"}
                />
                {comt?.commenter?.id === postdata?.User?.id && (
                  <small className="opacity-20 ">author</small>
                )}
                {/* if Post owner liked this post show the image of owner*/}
                {isPostOwnerLiked && (
                  <div className="flex justify-start items-center gap-2 text-xs/10 ">
                    {icons["heartFi"]}
                    <ProfileImage
                      className="w-5 h-5"
                      image={postdata.User.userImage}
                    />
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
                ]?.filter((itm) => itm)}
                content={comt}
              />
            </div>
            <div>
              <p>
                {comt.content} Lorem, ipsum dolor sit amet consectetur
                adipisicing elit. Est et, in excepturi aliquam veritatis
                voluptatibus omnis quo deleniti? Illo similique placeat alias.
                Esse et alias necessitatibus quia nisi corporis magni!
              </p>
            </div>
            <div className="flex justify-start items-center gap-3 my-3">
              <Ibutton
                className={"p-1 rounded-full"}
                action={() => {
                  likeUnlikeMutation(comt?.id);
                  setOptLike(comt?.id);
                }}
              >
                {(() => {
                  const showFilled =
                    (optLike === comt?.id && !isLiked) ||
                    (optLike === "" && isLiked);
                  return showFilled ? icons["heartFi"] : icons["heartO"];
                })()}
                {memoLike}
              </Ibutton>
              <Ibutton
                className={"p-1 rounded-full"}
                action={() =>
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
              </Ibutton>
              {/* {(comt?.commenter?.id === user.id ||
                  postdata.User.id === user.id) && (
                  <button onClick={() => deletMutate(comt?.id)}>
                    <MdDelete />
                  </button>
                )} */}
              {!comt?.topCommentId && postdata.User.id === user.id && (
                <Ibutton
                  className="opacity-30 "
                  action={() =>
                    pinMutation({ pin: !comt.pind, commentId: comt.id })
                  }
                >
                  {icons["pin"]}
                </Ibutton>
              )}
            </div>
          </div>
        </div>
        {!comt?.topCommentId && (
          <Ibutton
            className={"ml-12 px-1 text-blue-500 rounded-full"}
            action={handleRepliesClick}
          >
            {openReplies !== comt.id ? icons["arrowDown"] : icons["arrowUp"]}
            Replies {abbreviateNumber(comt?.reply?.length)}
          </Ibutton>
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
});

export default memo(CommentBox);
