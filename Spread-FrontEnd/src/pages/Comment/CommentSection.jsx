import React, { memo, useEffect, lazy, Suspense } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import PostsApis from "../../Apis/PostsApis";
import { useLastPostObserver } from "../../hooks/useLastPostObserver";
import Spinner from "../../component/loaders/Spinner";
import CommentInput from "./CommentInput";
import { setCommentCred } from "../../redux/slices/postSlice";
import { useNavigate } from "react-router-dom";
const CommentBox = lazy(() => import("./CommentBox"));

function CommentSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { getComments } = PostsApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: TopComments,
    error: errorPosts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["TopComments"],
    ({ pageParam = 1 }) =>
      getComments({ postId: commentCred.postId, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const Comments = TopComments?.pages?.flatMap((page) => page.comments) || [];
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
      className="flex justify-end items-end fixed top-0 right-0 left-0 bg-black bg-opacity-30 backdrop-blur-[1px]  w-full  animate-fedin.2s  shadow h-full z-40 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#f3efeb] dark:bg-black sm:border-s border-inherit flex flex-col gap-2 py-5  sm:animate-slide-in-right  animate-slide-in-bottom lg:w-[30rem] w-full rounded-md  sm:h-full h-[80%] "
      >
        <h1 className="text-xl p-4">Comments</h1>
        <CommentInput
          className={
            "fixed bg-[#f3efeb] border-t border-[#1d1c1c22] dark:bg-black bottom-0 z-10 flex justify-start items-start gap-5  w-full animate-slide-in-top  p-5  dark:border-inherit"
          }
        />
        <div className=" px-4 flex flex-col justify-start pb-32 items-center w-full h-full overflow-y-auto ">
          <Suspense
            fallback={
              <Spinner
                className={
                  "w-10 h-10 m-auto border-t-black dark:border-t-white"
                }
              />
            }
          >
            {Comments.map((comt, idx, arr) => {
              return (
                <CommentBox
                  ref={arr.length % 5 === 0 ? lastpostRef : null}
                  className={
                    "animate-slide-in-top flex flex-col text-sm justify-center w-full items-start gap-2"
                  }
                  key={comt?.id}
                  comt={comt}
                  topCommentId={comt?.id} // Here we maping top most post and setting top most to these comment of it self
                />
              );
            })}
          </Suspense>
          {isFetchingNextPage && (
            <div className=" flex justify-center items-center py-2 h-20">
              <Spinner
                className={"w-5 h-5 m-auto border-t-black dark:border-t-white"}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(CommentSection);
