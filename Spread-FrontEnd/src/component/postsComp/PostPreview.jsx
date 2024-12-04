import React, {
  useCallback,
  useState,
  forwardRef,
  memo,
  lazy,
  Suspense,
} from "react";
import { format } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient, useQuery } from "react-query";
import { setToast } from "../../redux/slices/uiSlice";

import profileIcon from "/ProfOutlook.png";
import PostsApis from "../../Apis/PostsApis";
import Spinner from "../loaders/Spinner"; // A spinner to show during lazy loading

// Dynamically load components to optimize performance
import Bookmark from "../buttons/Bookmark";
import Like from "../buttons/Like";
import Menu from "./menu";

const PostPreview = forwardRef(({ post, className, Saved }, ref) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const renderImage = useCallback(() => {
    return post?.user?.userImage ? post.user.userImage : profileIcon;
  }, [post?.user?.userImage]);

  return (
    <>
      <article
        ref={ref}
        className={`border-b border-inherit flex w-full mt-1 h flex-col ${className}`}
      >
        <div className="p-3 flex leading-0 flex-col h-full justify-center gap-3 w-full">
          <div className="flex gap-2 text-sm justify-start items-center">
            <Link
              to={`/profile/@${post?.user?.username
                .split(" ")
                .slice(0, post?.user?.username?.length - 1)
                .join("")}/${post?.user?.id}`}
              className="flex gap-3"
            >
              <div
                className={`h-[2rem] w-[2rem] hover:opacity-75 rounded-full`}
              >
                <img
                  className="cursor-pointer object-cover object-top h-full w-full rounded-full"
                  src={renderImage()}
                  loading="lazy"
                  alt={post?.user?.username}
                />
              </div>
            </Link>
            <div className="text-sm rounded-lg flex">
              {post ? (
                <p className="capitalize">{post?.user?.username}</p>
              ) : (
                <span className="w-20 h-3 bg-slate-300 animate-pulse dark:bg-slate-700 bg-inherit rounded-xl"></span>
              )}
            </div>
            <h1 className="text-opacity-30 text-black dark:text-white dark:text-opacity-30 rounded-lg">
              {post?.topic}
            </h1>
          </div>
          <Link
            to={`/view/@${post?.user?.username
              .split(" ")
              .slice(0, post?.user?.username.length - 1)
              .join("")}/${post?.id}`}
            className="cursor-pointer h-full flex justify-between items-center gap-3"
          >
            <div className="flex flex-col gap-1  w-96  ">
              {post ? (
                <>
                  <p className="font-medium text-sm sm:text-3xl overflow-hidden overflow-ellipsis">
                    {post?.title}
                  </p>
                  <p className="text-sm sm:text-base text-opacity-60 text-black dark:text-white dark:text-opacity-60 font-normal overflow-hidden overflow-ellipsis">
                    {post?.subtitelpagraph}
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-lg sm:w-[20rem] w-[6.2rem] h-3 sm:h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
                  <div className="rounded-lg sm:w-[400px] w-[150px] h-5 sm:h-12 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                </>
              )}
            </div>

            <div className="rounded-sm h-[10rem] w-[15rem]  bg-slate-200 dark:bg-slate-700">
              {post && (
                <img
                  className="object-cover object-center h-full w-full"
                  src={post?.titleImage && `${post?.titleImage}`}
                  loading="lazy"
                  alt="PreviewImage"
                />
              )}
            </div>
          </Link>
          {post && (
            <div className="flex w-full h-full justify-between text-sm items-center mt-3">
              <div className="flex justify-start items-center gap-5">
                <span className="rounded-lg text-opacity-30 text-black dark:text-white dark:text-opacity-50">
                  {post?.createdAt
                    ? format(new Date(post?.createdAt), "LLL-dd-yyyy")
                    : ""}
                </span>
                <Like className={""} post={post} />
                <div className="flex cursor-pointer">
                  <button className="">
                    <i className="bi bi-chat"></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-5 items-center">
                <Bookmark post={post || null} />
                <Menu post={post} />
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
});

export default memo(PostPreview);
