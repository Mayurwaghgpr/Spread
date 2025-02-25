import React, {
  useCallback,
  useState,
  forwardRef,
  memo,
  lazy,
  Suspense,
  useEffect,
  useMemo,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Dynamically load components to optimize performance
import Bookmark from "../buttons/Bookmark";
import Like from "../buttons/Like/Like";
import Menu from "./Menu";
import FormatedTime from "../UtilityComp/FormatedTime";
import userImageSrc from "../../utils/userImageSrc";
import { FaRegComment } from "react-icons/fa6";
import abbreviateNumber from "../../utils/numAbrivation";
import { setCommentCred } from "../../redux/slices/postSlice";
import { useMutation } from "react-query";
import PostsApis from "../../Apis/PostsApis";
import { FaHashtag } from "react-icons/fa";
import menuCosntant from "./menuCosntant";

const PostPreview = forwardRef(({ post, className, Saved }, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAiGenTags } = PostsApis();
  const { commentCred } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const userImage = userImageSrc(post?.user);
  const { MENU_ITEMS } = menuCosntant();

  const Comments = useMemo(() => {
    return post?.comments?.filter((comment) => comment.topCommentId === null);
  }, [post?.comments]);

  useEffect(() => {
    dispatch(setCommentCred({ ...commentCred, postId: post?.id }));
  }, [post?.id, dispatch]);

  const handelComment = useCallback(() => {
    if (post?.user?.username && post?.id) {
      navigate(`/view/@${post?.user?.username}/${post?.id}/comments`);
    }
  }, [navigate, post?.user?.username, post?.id]);

  const {
    mutate,
    data,
    isLoading: tagLoading,
  } = useMutation({
    mutationFn: getAiGenTags,
  });
  return (
    <article
      ref={ref}
      className={` ${className} border-inherit flex w-full flex-col`}
    >
      <div className="p-3 flex leading-0 border-inherit flex-col  justify-center gap-4 w-full">
        <div className="flex justify-start items-center border-inherit gap-2 text-sm ">
          <Link
            to={`/profile/@${post?.user?.username}/${post?.user?.id}`}
            className="flex items-center justify-center gap-3"
          >
            <div
              className={`${!post && "animate-pulse bg-gray-300 dark:bg-gray-400"} h-[2rem] w-[2rem]  hover:opacity-75 rounded-full`}
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
            <div className="text-sm rounded-lg flex">
              {post ? (
                <p className="capitalize underline-offset-4 hover:underline">
                  {post?.user?.username}
                </p>
              ) : (
                <span className="w-20 h-3 bg-gray-300 animate-pulse dark:bg-gray-400 bg-inherit rounded-xl"></span>
              )}
            </div>
          </Link>

          <h1 className="text-opacity-30 text-black dark:text-white dark:text-opacity-30 rounded-lg">
            {post?.topic}
          </h1>

          {post && (
            <div className=" relative flex justify-center items-center cursor-pointer before:hidden before:hover:block  before:text-xs text-lg before:p-1 before:absolute  before:w-fit before:top-5 text-nowrap before:bg-black before:bg-opacity-20 before:rounded-md  before:content-['Generate_tags_with_ai']">
              <FaHashtag
                className={`${tagLoading && "animate-pulse"} `}
                onClick={() =>
                  mutate({
                    title: post?.title,
                    subtitle: post?.subtitelpagraph,
                    author: post?.user,
                    titleImage: post?.titleImage,
                  })
                }
              />
            </div>
          )}
        </div>
        <Link
          to={`/view/@${post?.user?.username}/${post?.id}`}
          className="relative cursor-pointer h-full border-inherit flex sm:flex-row sm:items-center flex-col-reverse  justify-between items-start gap-3"
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
                <div className="rounded-full sm:w-[20rem] w-[60%] h-6  bg-gray-300 dark:bg-gray-400 animate-pulse"></div>
                <div className="rounded-full sm:w-[25rem] w-[80%] h-4  bg-gray-300 dark:bg-gray-400 animate-pulse"></div>
                <div className="rounded-full sm:w-[25rem] w-[80%] h-4  bg-gray-300 dark:bg-gray-400 animate-pulse"></div>
              </>
            )}
          </div>

          <div
            className={`rounded-lg ${!post && " animate-pulse"} border border-inherit z-0 sm:w-72 sm:h-32 h-40  overflow-hidden w-full bg-gray-100 dark:bg-gray-400`}
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
        <div className="sm:text-sm text-[.7rem] flex-wrap flex justify-start items-center text-nowrap gap-2">
          {!tagLoading
            ? data &&
              data?.map((tag, idx) => (
                <span
                  className="dark:bg-gray-700 bg-[#e0dbd7] p-1 px-3 rounded-full"
                  key={idx}
                >
                  {tag}
                </span>
              ))
            : [...Array(5)].map(() => (
                <span className="bg-[#e0dbd7] block animate-pulse  p-3 rounded-full w-20 "></span>
              ))}
        </div>
        {post && (
          <div className="flex w-full h-full justify-between text-md border-inherit p-3 items-center ">
            <div className="flex justify-start items-center gap-3">
              <Like className={"min-w-10"} post={post} />
              <button
                onClick={handelComment}
                className="flex justify-center items-center gap-1 min-w-10 cursor-pointer"
              >
                <FaRegComment />
                <span>{abbreviateNumber(Comments?.length)}</span>
              </button>
            </div>
            <div className="flex justify-end gap-5 items-center border-inherit">
              <Bookmark
                className={"text-black dark:text-white "}
                post={post || null}
              />
              <Menu
                items={[
                  MENU_ITEMS["copylike"],
                  MENU_ITEMS["share"],
                  post.authorId === user.id && MENU_ITEMS["deletePost"],
                  post.authorId === user.id && MENU_ITEMS["editPost"],
                ]}
                content={post}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
});

export default memo(PostPreview);
