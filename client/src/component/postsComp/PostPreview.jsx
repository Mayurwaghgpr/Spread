import React, {
  useCallback,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Dynamically load components to optimize performance
import Bookmark from "../buttons/Bookmark";
import Like from "../buttons/Like/Like";
import Menu from "../Menus/Menu";
import { setCommentCred } from "../../store/slices/postSlice";

import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import useIcons from "../../hooks/useIcons";
import useClickOutside from "../../hooks/useClickOutside";
import useMenuConstant from "../../hooks/useMenuConstant";
import AbbreviateNumber from "../../utils/AbbreviateNumber";
import FedInBtn from "../buttons/FedInBtn";

const PostPreview = forwardRef(({ post, className, Saved }, ref) => {
  const { commentCred } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userImageurl } = userImageSrc(post?.user);
  const menuRef = useRef(null);
  const icons = useIcons();
  const { menuId, setMenuId } = useClickOutside(menuRef);
  const { POST_MENU } = useMenuConstant(post, "post");

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
  return (
    <article
      ref={ref}
      className={`${className} border-inherit flex w-full flex-col max-h-[20rem]  rounded-lg`}
    >
      <div className="p-3 sm:p-4 md:p-6 flex leading-0 border-inherit flex-col justify-center gap-3 sm:gap-4 w-full">
        {/* Header with user profile */}
        <header className="flex justify-start items-center border-inherit gap-2 sm:gap-3 text-xs sm:text-sm">
          <Link
            to={`/profile/@${post?.user?.username}/${post?.user?.id}`}
            className="flex items-center justify-center gap-2 sm:gap-3 min-w-0 flex-shrink-0"
          >
            <ProfileImage
              className={` h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:opacity-75 rounded-full `}
              image={post && userImageurl}
            />
            <div className="text-xs sm:text-sm rounded-lg flex min-w-0">
              {post ? (
                <p className="capitalize underline-offset-4 hover:underline">
                  {post?.user?.username}
                </p>
              ) : (
                <span className="w-16 sm:w-20 h-3 animate-pulse bg-gray-300 dark:bg-gray-700 bg-inherit rounded-xl"></span>
              )}
            </div>
          </Link>

          {/* Topic - hide on very small screens */}
          <h1 className="text-opacity-30 opacity-30 rounded-lg text-xs sm:text-sm truncate hidden xs:block">
            {post?.topic}
          </h1>
        </header>

        {/* Post content */}
        <Link
          to={`/view/@${post?.user?.username}/${post?.id}`}
          className={`relative  ${post ? "cursor-pointer" : "cursor-not-allowed"} h-full border-inherit flex items-start justify-between gap-3 sm:gap-4`}
        >
          <div className="flex w-full flex-col  min-w-0 flex-grow">
            {post ? (
              <>
                <h2 className=" text-base sm:text-lg md:text-2xl font-bold leading-tight overflow-hidden">
                  <span className="line-clamp-2 sm:line-clamp-3">
                    {post?.title}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm lg:text-base opacity-60 font-normal overflow-hidden leading-relaxed">
                  <span className="line-clamp-2 sm:line-clamp-3">
                    {post?.subtitle}
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="rounded-full w-[80%] sm:w-[60%] h-4 sm:h-6 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                <div className="rounded-full w-[90%] sm:w-[80%] h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                <div className="rounded-full w-[75%] sm:w-[80%] h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
              </>
            )}
          </div>

          {/* Preview Image - responsive sizing */}
          <div
            className={`relative ${
              !post && "animate-pulse"
            } border border-inherit z-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 lg:w-40 lg:h-28 rounded flex-shrink-0 bg-gray-300 dark:bg-gray-700`}
          >
            {post && post?.previewImage && (
              <img
                className="w-full h-full object-cover object-center rounded"
                src={post.previewImage}
                alt="Post preview"
                loading="lazy"
              />
            )}
          </div>
        </Link>

        {/* Footer with actions */}
        {post && (
          <footer className="flex justify-between items-center w-full text-sm sm:text-base border-inherit px-0 sm:px-3 font-light">
            <div className="flex justify-start items-center gap-2 sm:gap-3 min-w-0">
              <Like className="min-w-8 sm:min-w-10 flex-shrink-0" post={post} />
              <FedInBtn
                className="opacity-50 hover:opacity-100 flex items-center gap-1 sm:gap-2 min-w-0"
                action={handelComment}
              >
                <span className="flex-shrink-0">{icons["comment"]}</span>
                <span className="text-xs sm:text-sm">
                  <AbbreviateNumber rawNumber={Comments?.length} />
                </span>
              </FedInBtn>
            </div>

            <div className="flex justify-end gap-3 sm:gap-5 items-center border-inherit">
              <Bookmark className="flex-shrink-0" post={post || null} />
              <Menu
                ref={menuRef}
                items={POST_MENU}
                menuId={menuId}
                setMenuId={setMenuId}
                content={post}
                className="w-full flex-shrink-0 "
              />
            </div>
          </footer>
        )}
      </div>
    </article>
  );
});

export default memo(PostPreview);
