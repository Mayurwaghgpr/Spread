import React, { memo, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import PostsApis from "../Apis/PostsApis";
import { useLastPostObserver } from "../hooks/useLastPostObserver";
import Comment from "../component/postsComp/comment";

function CommentSection({ setOpenComments, postId }) {
  const { isLogin, user } = useSelector((state) => state.auth);
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
    ({ pageParam = 1 }) => getComments({ postId, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const Comments = TopComments?.pages.flatMap((page) => page.comments) || [];
  console.log(Comments);
  return (
    <section
      onClick={({ target }) => setOpenComments(false)}
      className="flex justify-end items-end  w-full right-1 animate-fedin.2s bg-opacity-50 shadow h-full fixed top-0 z-40 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex flex-col gap-5 animate-slide-in-right dark:bg-[#272727] w-[30rem] rounded-md  h-full  p-5 overflow-auto"
      >
        <h1 className="text-xl">Comments</h1>
        <div className=" w-full shadow-xl  p-1 rounded-xl">
          <div className="flex p-3 justify-start items-center gap-3 text-sm">
            <span className="w-10 h-10 rounded-full ">
              {" "}
              <img
                className="w-full h-full object-cover object-top rounded-full"
                src={`${import.meta.env.VITE_BASE_URL}/${user?.userImage}`}
                alt={user.username}
              />
            </span>
            <p>{user.username}</p>
          </div>
          <div className="w-full">
            {" "}
            <textarea
              className="w-full h-32 bg-slate-50 rounded-lg outline-none p-3 placeholder:text-center resize-none"
              placeholder="What are your thoughts?"
            ></textarea>
          </div>
          <div className=" flex justify-end p-4 gap-3">
            <span>
              <button className=" border border-inherit py-1 px-2 rounded-full">
                cancle
              </button>
            </span>
            <span>
              <button className=" bg-sky-200  py-1 px-5  rounded-full">
                <i class="bi bi-send-fill"></i>
              </button>
            </span>
          </div>
        </div>
        <div className="">
          {Comments.map((comt) => {
            return <Comment key={comt.id} comt={comt} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(CommentSection);
