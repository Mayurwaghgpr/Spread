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
import FormatedTime from "../UtilityComp/FormatedTime";

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
        className={` border-b  border-inherit flex w-full  h flex-col ${className}`}
      >
        <div className="p-3 flex leading-0 border-inherit flex-col h-full justify-center gap-4 w-full">
          <div className="flex border-inherit gap-2 text-sm justify-start items-center">
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
            <FormatedTime
              date={post?.createdAt}
              className={
                "rounded-lg font-light text-opacity-30 text-black dark:text-slate-400 dark:text-opacity-40"
              }
            />
          </div>
          <Link
            to={`/view/@${post?.user?.username
              .split(" ")
              .slice(0, post?.user?.username.length - 1)
              .join("")}/${post?.id}`}
            className="relative cursor-pointer h-full border-inherit flex sm:flex-row flex-col-reverse justify-between items-center gap-3"
          >
            <div className="flex w-full flex-col gap-1">
              {post ? (
                <>
                  <p className="font-medium text-xl sm:text-2xl overflow-hidden overflow-ellipsis">
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

            <div className="rounded-lg sm:h-[10rem] border border-inherit z-0 sm:w-[15rem] h-[10rem] overflow-hidden w-full bg-slate-200 dark:bg-slate-700">
              {post && (
                <img
                  className="object-fill object-center z-0 h-full w-full"
                  src={post?.titleImage && `${post?.titleImage}`}
                  loading="lazy"
                  alt="PreviewImage"
                />
              )}
            </div>
          </Link>
          {post && (
            <div className="flex w-full h-full justify-between text-md border rounded-md border-inherit p-3 items-center ">
              <div className="flex justify-start items-center gap-5">
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
