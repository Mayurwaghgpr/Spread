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

const CommentBox = forwardRef(({ comt, className, topCommentId }, ref) => {
  const [openReplies, setOpenReplies] = useState("");
  const [optLike, setOptLike] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { hitLike, getReplies, deleteComtApi, pinComment } = PostsApis();
  const dispatch = useDispatch();
  const postdata = useOutletContext();
  const { COMMENT_MENU } = useMenuConstant(comt, "comment");
  const icons = useIcons();
  const menuRef = useRef(null);
  const { menuId, setMenuId } = useClickOutside(menuRef);

  const commenterImg = userImageSrc(comt?.commenter);
  const isLiked = comt?.commentLikes?.some((like) => like.likedBy === user.id);

  const memoLike = useMemo(() => {
    if (optLike === comt?.id && !isLiked) {
      return <AbbreviateNumber rawNumber={comt?.commentLikes?.length + 1} />;
    } else if (isLiked && optLike === comt?.id) {
      return <AbbreviateNumber rawNumber={comt?.commentLikes?.length - 1} />;
    } else {
      return <AbbreviateNumber rawNumber={comt?.commentLikes?.length} />;
    }
  }, [optLike, comt?.commentLikes?.length]);

  const { mutate: pinMutation } = useMutation({
    mutationFn: (data) => pinComment(data),
    onSuccess: (data) => {
      console.log({ data });
      comt.pind = data.pind;
      dispatch(setToast({ message: "Comment pinned!", type: "success" }));

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
      enabled: comt?.reply?.length > 0 && openReplies === comt?.id, // Only fetch when replies are open
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: likeMutation } = useMutation({
    mutationFn: (comtId) => hitLike(comtId),
    onSuccess: ({ message, updtCommentLikes }) => {
      comt.commentLikes = updtCommentLikes || [];
      setOptLike("");
      dispatch(
        setToast({
          message: `${message} the comment!`,
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
    <div id={`/${comt?.commenter?.id}`} ref={ref} className={`${className}`}>
      <article className=" flex flex-col  w-full justify-center items-start gap-2 select-none border-inherit">
        <div className=" grid grid-cols-12 border-inherit w-full gap-3">
          <ProfileImage
            className={`flex justify-center items-center col-span-1  rounded-full ${!comt ? " dark:bg-white bg-black bg-opacity-20 dark:bg-opacity-20 animate-pulse " : ""} ${
              isTopComment
                ? " sm:w-10 sm:h-10 w-8 h-8 "
                : " sm:w-8 sm:h-8 w-6 h-6"
            } `}
            image={comt && commenterImg?.userImageurl}
            alt={comt?.commenter?.username}
          />
          <div className="flex flex-col justify-center items-start  col-start-3 col-span-full w-full border-inherit">
            <div className="flex justify-between w-full items-center text-nowrap border-inherit ">
              <div
                className={`${!comt ? "w-1/4 p-1 my-3 rounded-full animate-pulse dark:bg-white bg-black bg-opacity-20 dark:bg-opacity-20  " : ""} flex justify-start items-center text-nowrap gap-2 text-sm border-inherit`}
              >
                <h1 className="font-semibold">{comt?.commenter?.username}</h1>
                {/*pind comment */}
                {comt?.pind && icons["pin"]}
                <FormatedTime
                  date={comt?.createdAt}
                  className={` opacity-20 ${comt?.topCommentId === null ? "text-xs" : "text-[.6rem]"}`}
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
                  " sm:absolute sm:top-5 right-0 sm:h-fit h-1/2 sm:p-1 p-6 z-10"
                }
                ref={menuRef}
                menuId={menuId}
                setMenuId={setMenuId}
                items={COMMENT_MENU}
                content={comt}
              />
            </div>
            <div
              className={`${!comt ? "w-full p-3 rounded-full animate-pulse dark:bg-white bg-black bg-opacity-20 dark:bg-opacity-20  " : ""} break-words w-[75%] `}
            >
              <p
                className="w-full text-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comt?.content || ""),
                  // Using DOMPurify to sanitize the content to prevent XSS attacks
                }}
              ></p>
            </div>
            {comt && (
              <div className="flex justify-start items-center gap-3 my-3">
                <Ibutton
                  className={"p-1 rounded-full"}
                  action={() => {
                    likeMutation(comt?.id);
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
                        at: comt?.commenter?.username,
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
            )}
          </div>
        </div>
        {comt && !comt?.topCommentId && (
          <Ibutton
            className={
              " ml-12 flex justify-center items-center gap-2 px-1 text-blue-500 rounded-full"
            }
            action={handleRepliesClick}
          >
            {openReplies !== comt?.id ? icons["arrowDown"] : icons["arrowUp"]}
            Replies <AbbreviateNumber rawNumber={comt?.reply?.length} />
            {isLoading && <Spinner className={"w-3 h-3 bg-black p-0.5"} />}
          </Ibutton>
        )}
      </article>
      {openReplies === comt?.id && Comments?.length > 0 && (
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
