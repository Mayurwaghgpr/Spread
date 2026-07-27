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
import Bookmark from "../buttons/bookmark/Bookmark";
import Like from "../buttons/Like/Like";
import Menu from "../menus/Menu";
import { setCommentCred } from "../../store/slices/postSlice";

import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/functions/userImageSrc";
import useIcons from "../../hooks/useIcons";
import useClickOutside from "../../hooks/useClickOutside";
import useMenuConstant from "../../hooks/useMenuConstant";
import AbbreviateNumber from "../../utils/components/AbbreviateNumber";
import FedInBtn from "../buttons/FedInBtn";

const PostPreview = forwardRef(({ post, className, Saved }, ref) => {
  const { commentCred } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userImageurl } = userImageSrc(post?.author);
  const menuRef = useRef(null);
  const icons = useIcons();
  const { menuId, setMenuId } = useClickOutside(menuRef);
  const { POST_MENU } = useMenuConstant(
    post,
    "post",
    `${window.location.origin}/view/@${post?.author?.username}/${post?.id}`,
  );

  const Comments = useMemo(() => {
    return post?.comments?.filter((comment) => comment.topCommentId === null);
  }, [post?.comments]);

  useEffect(() => {
    dispatch(setCommentCred({ ...commentCred, postId: post?.id }));
  }, [post?.id, dispatch]);

  const handelComment = useCallback(() => {
    if (post?.author?.username && post?.id) {
      navigate(`/view/@${post?.author?.username}/${post?.id}/comments`);
    }
  }, [navigate, post?.author?.username, post?.id]);
  return (
    <article
      ref={ref}
      className={`${className} border border-[#d8cebe] dark:border-[#2a2a2a] bg-laccent/30 dark:bg-daccent/30 flex w-full flex-col max-h-[22rem] rounded-xl transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-700`}
    >
      <div className="p-4 sm:p-5 md:p-6 flex leading-0 flex-col justify-center gap-3 sm:gap-4 w-full">
        {/* Header with user profile */}
        <header className="flex justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <Link
            to={`/profile/@${post?.author?.username}/${post?.author?.id}`}
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0 focus-ring rounded-lg"
          >
            <ProfileImage
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 hover:opacity-80 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
              image={post && userImageurl}
            />
            <div className="text-xs sm:text-sm flex flex-col min-w-0">
              {post ? (
                <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize hover:underline">
                  {post?.author?.username}
                </p>
              ) : (
                <span className="w-16 sm:w-20 h-3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl" />
              )}
            </div>
          </Link>

          {/* Topic - hide on very small screens */}
          {post?.topic && (
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-gray-200/70 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 truncate">
              {post?.topic}
            </span>
          )}
        </header>

        {/* Post content */}
        <Link
          to={`/view/@${post?.author?.username}/${post?.id}`}
          className={`relative ${
            post ? "cursor-pointer" : "cursor-not-allowed"
          } h-full flex items-start justify-between gap-3 sm:gap-4 focus-ring rounded-lg`}
        >
          <div className="flex w-full flex-col min-w-0 flex-grow gap-1.5">
            {post ? (
              <>
                <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-snug overflow-hidden">
                  <span className="line-clamp-2 sm:line-clamp-3">
                    {post?.title}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-normal overflow-hidden leading-relaxed">
                  <span className="line-clamp-2">
                    {post?.subtitle}
                  </span>
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <div className="rounded-full w-[80%] sm:w-[60%] h-4 sm:h-5 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                <div className="rounded-full w-[90%] sm:w-[80%] h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
              </div>
            )}
          </div>

          {/* Preview Image */}
          <div
            className={`relative ${
              !post && "animate-pulse"
            } border border-gray-200/50 dark:border-gray-800/50 z-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 lg:w-36 lg:h-24 rounded-lg flex-shrink-0 bg-gray-200 dark:bg-gray-800 overflow-hidden`}
          >
            {post && post?.previewImage && (
              <img
                className="w-full h-full object-cover object-center rounded-lg"
                src={post.previewImage}
                alt="Post preview"
                loading="lazy"
              />
            )}
          </div>
        </Link>

        {/* Footer with actions */}
        {post && (
          <footer className="flex justify-between items-center w-full text-xs sm:text-sm pt-2 border-t border-gray-200/40 dark:border-gray-800/40">
            <div className="flex justify-start items-center gap-3 min-w-0">
              <Like className="min-w-8 sm:min-w-10 flex-shrink-0" post={post} />
              <FedInBtn
                className="opacity-70 hover:opacity-100 flex items-center gap-1.5 focus-ring rounded-lg px-1.5 py-1"
                action={handelComment}
              >
                <span className="flex-shrink-0 text-base">{icons["comment"]}</span>
                <span className="text-xs font-medium">
                  <AbbreviateNumber rawNumber={Comments?.length} />
                </span>
              </FedInBtn>
            </div>

            <div className="flex justify-end gap-3 sm:gap-4 items-center">
              <Bookmark className="flex-shrink-0" post={post || null} />
              <Menu
                ref={menuRef}
                items={POST_MENU}
                menuId={menuId}
                setMenuId={setMenuId}
                content={post}
                className="flex-shrink-0"
              />
            </div>
          </footer>
        )}
      </div>
    </article>
  );
});

export default memo(PostPreview);
