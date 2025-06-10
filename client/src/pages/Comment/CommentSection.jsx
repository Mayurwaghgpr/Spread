import React, { memo, useEffect, lazy, Suspense } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import PostsApis from "../../services/PostsApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import Spinner from "../../component/loaders/Spinner";
import CommentInput from "./CommentInput";
import { setCommentCred } from "../../store/slices/postSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import CommentBox from "./CommentBox";

function CommentSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { getComments } = PostsApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const icons = useIcons();

  const postdata = useOutletContext();
  const {
    data: TopComments,
    error: errorPosts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["TopComments"],
    ({ pageParam = 1 }) => getComments({ postId: postdata?.id, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const Comments = TopComments?.pages?.flatMap((page) => page.comments) || [];
  const commentPins = Comments.filter((comment) => comment.pind);

  return (
    <section
      onClick={() => {
        navigate(-1, { replace: true });
        dispatch(
          setCommentCred({
            ...commentCred,
            topCommentId: null,
            at: "",
            content: "",
            replyTo: null,
          })
        );
      }}
      className=" flex justify-end items-end lg:sticky lg:top-[4.3rem] fixed top-0 right-0 left-0 w-full  animate-fedin.2s  lg:h-[90vh] h-full sm:z-0 z-30 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col gap-2 max-w-[30rem] w-full lg:h-full h-[60%] border sm:border border-inherit sm:m-0 rounded-xl m-1 bg-[#f3efeb] dark:bg-black  sm:animate-none  animate-slide-in-bottom   overflow-hidden "
      >
        <div className="flex items-center justify-between p-4 border-b border-inherit ">
          <h1 className="text-xl ">Comments</h1>
          <Ibutton
            className={"p-1 rounded-full"}
            action={() => {
              navigate(-1, { replace: true });
              dispatch(
                setCommentCred({
                  ...commentCred,
                  topCommentId: null,
                  at: "",
                  content: "",
                  replyTo: null,
                })
              );
            }}
          >
            {icons["close"]}
          </Ibutton>
        </div>

        <div className="flex flex-col justify-start items-center gap-5 pb-10 pt-5 px-5  w-full h-[80%] overflow-y-auto border-inherit ">
          {(!isFetching ? Comments : Array(20).fill(null)).map(
            (comt, idx, arr) => {
              return (
                <CommentBox
                  ref={comt && arr.length % 5 === 0 ? lastItemRef : null}
                  className={
                    "animate-slide-in-top flex flex-col text-sm justify-center w-full items-start gap-2 border-inherit"
                  }
                  key={comt?.id}
                  comt={comt}
                  commentPins={commentPins}
                  topCommentId={comt?.id} // Here we maping top most post and setting top most to these comment of it self
                />
              );
            }
          )}
          {isFetchingNextPage && (
            <div className=" flex justify-center items-center py-2 h-20">
              <Spinner className={"w-5 h-5  bg-black dark:bg-white"} />
            </div>
          )}
        </div>
        <CommentInput
          className={
            "flex justify-center items-start gap-5 w-full p-5 z-10 bg-[#f3efeb] border-t border-[#1d1c1c22] dark:bg-black animate-slide-in-top dark:border-inherit"
          }
        />
      </div>
    </section>
  );
}

export default memo(CommentSection);
