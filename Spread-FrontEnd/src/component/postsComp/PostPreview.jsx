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
import Like from "../buttons/Like/Like";
import Menu from "./menu";
import FormatedTime from "../UtilityComp/FormatedTime";
import userImageSrc from "../../utils/userImageSrc";
import { BsCommand } from "react-icons/bs";
import { FaComment, FaRegComment } from "react-icons/fa6";
import abbreviateNumber from "../../utils/numAbrivation";

const PostPreview = forwardRef(({ post, className, Saved }, ref) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const userImage = userImageSrc(post?.user);

  return (
    <article
      ref={ref}
      className={` border-inherit flex w-full h-fit  flex-col ${className}`}
    >
      <div className="p-3 flex leading-0 border-inherit flex-col  justify-center gap-4 w-full">
        <div className="flex border-inherit gap-2 text-sm justify-start items-center">
          <Link
            to={`/profile/@${post?.user?.username
              .split(" ")
              .slice(0, post?.user?.username?.length - 1)
              .join("")}/${post?.user?.id}`}
            className="flex gap-3"
          >
            <div
              className={`${!post && "animate-pulse bg-gray-200 dark:bg-gray-400"} h-[2rem] w-[2rem]  hover:opacity-75 rounded-full`}
            >
              {post && (
                <img
                  className="cursor-pointer object-cover object-top h-full w-full rounded-full"
                  src={userImage.userImageurl}
                  loading="lazy"
                  alt={post?.user?.username}
                />
              )}
            </div>
          </Link>
          <div className="text-sm rounded-lg flex">
            {post ? (
              <p className="capitalize">{post?.user?.username}</p>
            ) : (
              <span className="w-20 h-3 bg-gray-200 animate-pulse dark:bg-gray-400 bg-inherit rounded-xl"></span>
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
          className="relative cursor-pointer h-full border-inherit flex xl:flex-row flex-col-reverse justify-between items-center gap-3"
        >
          <div className="flex w-full flex-col gap-1">
            {post ? (
              <>
                <p className="font-medium text-xl sm:text-2xl overflow-hidden overflow-ellipsis">
                  {post?.title}
                </p>
                <p className="text-sm sm:text-base h-11 text-opacity-60 text-black dark:text-white dark:text-opacity-60 font-normal overflow-hidden overflow-ellipsis">
                  {post?.subtitelpagraph}
                </p>
              </>
            ) : (
              <>
                <div className="rounded-full sm:w-[20rem] w-[6.2rem] h-6  bg-gray-200 dark:bg-gray-400 animate-pulse"></div>
                <div className="rounded-full sm:w-[25rem] w-[150px] h-4  bg-slate-200 dark:bg-gray-400 animate-pulse"></div>
                <div className="rounded-full sm:w-[25rem] w-[150px] h-4  bg-slate-200 dark:bg-gray-400 animate-pulse"></div>
              </>
            )}
          </div>

          <div
            className={`rounded-lg ${!post && " animate-pulse"}  border border-inherit z-0 xl:w-72 xl:h-32 min-h-40  overflow-hidden w-full bg-slate-200 dark:bg-gray-400`}
          >
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
          <div className="flex w-full h-full justify-between text-md  border-inherit p-3 items-center ">
            <div className="flex   justify-start   items-center gap-3">
              <Like className={"min-w-10"} post={post} />
              <div className="flex justify-center items-center gap-1 min-w-10 cursor-pointer">
                <button className="">
                  <FaRegComment />
                </button>
                <span>{abbreviateNumber(post?.comments?.length)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-5 items-center">
              <Bookmark
                className={"text-black dark:text-white "}
                post={post || null}
              />
              <Menu post={post} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
});

export default memo(PostPreview);
