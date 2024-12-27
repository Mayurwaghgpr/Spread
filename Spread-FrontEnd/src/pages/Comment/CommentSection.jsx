import React, { memo, useEffect, lazy, Suspense } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import PostsApis from "../../Apis/PostsApis";
import { useLastPostObserver } from "../../hooks/useLastPostObserver";
import Spinner from "../../component/loaders/Spinner";
import CommentInput from "./CommentInput";
import { setCommentCred } from "../../redux/slices/postSlice";
const CommentBox = lazy(() => import("./CommentBox"));

function CommentSection({ setOpenComments, post }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { commentCred } = useSelector((state) => state.posts);
  const { getComments } = PostsApis();
  const {
    data: TopComments,
    error: errorPosts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["TopComments"],
    ({ pageParam = 1 }) => getComments({ postId: post.id, pageParam }),
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
  useEffect(() => {
    const postId = post?.id;
    dispatch(
      setCommentCred({
        ...commentCred,
        postId,
        // replyTo: post?.User?.id,
      })
    ); //Setting data initialy
  }, []);
  const Comments = TopComments?.pages.flatMap((page) => page.comments) || [];
  return (
    <section
      onClick={({ target }) => {
        setOpenComments(false);
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
      className="flex justify-end items-end bg-black bg-opacity-30 backdrop-blur-[1px]  w-full right-0 animate-fedin.2s  shadow h-full fixed top-0 z-40 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#f3efeb] dark:bg-black border-s border-inherit flex flex-col gap-2 py-5  sm:animate-slide-in-right  animate-slide-in-bottom w-[30rem] rounded-md  sm:h-full h-[80%] "
      >
        <h1 className="text-xl p-4">Comments</h1>
        <CommentInput
          className={
            "fixed bg-[#f3efeb] border-t border-[#1d1c1c22] dark:bg-black bottom-0 z-10 flex justify-start items-start gap-5  w-full animate-slide-in-top  p-5  dark:border-inherit"
          }
        />
        <div className=" px-2 flex flex-col justify-start mb-32 items-center w-full overflow-y-auto ">
          <Suspense
            fallback={
              <Spinner
                className={
                  "w-10 h-10 m-auto border-t-black dark:border-t-white"
                }
              />
            }
          >
            {Comments.map((comt) => {
              return (
                <CommentBox
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
        </div>
      </div>
    </section>
  );
}

export default memo(CommentSection);
