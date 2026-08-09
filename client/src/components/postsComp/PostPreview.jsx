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

const PostPreview = forwardRef(({ post, className = "", Saved }, ref) => {
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
      className={`spread-card flex w-full flex-col rounded-2xl transition-all duration-200 hover:border-stone-400 dark:hover:border-stone-600 ${className}`}
    >
      <div className="flex flex-col justify-between gap-3 sm:gap-4 w-full h-full">
        {/* Header with user profile */}
        <header className="flex justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <Link
            to={`/profile/@${post?.author?.username}/${post?.author?.id}`}
            className="flex items-center gap-2.5 min-w-0 flex-shrink-0 focus-ring rounded-lg"
          >
            <ProfileImage
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 hover:opacity-80 rounded-full border border-inherit object-cover"
              image={post && userImageurl}
            />
            <div className="text-xs sm:text-sm flex flex-col min-w-0">
              {post ? (
                <p className="font-semibold text-stone-900 dark:text-stone-100 capitalize hover:underline truncate">
                  {post?.author?.username}
                </p>
              ) : (
                <span className="w-16 sm:w-20 h-3 animate-pulse bg-stone-300 dark:bg-stone-700 rounded-xl" />
              )}
            </div>
          </Link>

          {/* Topic badge */}
          {post?.topic && (
            <span className="spread-pill text-[11px] truncate max-w-[120px] sm:max-w-[180px]">
              {post?.topic}
            </span>
          )}
        </header>

        {/* Post content */}
        <Link
          to={`/view/@${post?.author?.username}/${post?.id}`}
          className={`relative ${
            post ? "cursor-pointer" : "cursor-not-allowed"
          } flex items-start justify-between gap-3 sm:gap-4 focus-ring rounded-lg flex-1 min-h-0`}
        >
          <div className="flex w-full flex-col min-w-0 flex-grow gap-1.5">
            {post ? (
              <>
                <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
                  <span className="line-clamp-2 sm:line-clamp-3">
                    {post?.title}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-normal leading-relaxed">
                  <span className="line-clamp-2">
                    {post?.subtitle}
                  </span>
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <div className="rounded-full w-[80%] sm:w-[60%] h-4 sm:h-5 bg-stone-300 dark:bg-stone-700 animate-pulse" />
                <div className="rounded-full w-[90%] sm:w-[80%] h-3 sm:h-4 bg-stone-300 dark:bg-stone-700 animate-pulse" />
              </div>
            )}
          </div>

          {/* Preview Image */}
          {post && post?.previewImage && (
            <div className="relative border border-inherit shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-32 md:h-22 rounded-xl bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <img
                className="w-full h-full object-cover object-center rounded-xl"
                src={post.previewImage}
                alt="Post preview"
                loading="lazy"
              />
            </div>
          )}
        </Link>

        {/* Footer with actions */}
        {post && (
          <footer className="flex justify-between items-center w-full text-xs sm:text-sm pt-2.5 border-t border-inherit mt-1">
            <div className="flex justify-start items-center gap-3 min-w-0">
              <Like className="min-w-8 sm:min-w-10 flex-shrink-0" post={post} />
              <FedInBtn
                className="opacity-70 hover:opacity-100 flex items-center gap-1.5 focus-ring rounded-lg px-2 py-1 hover:bg-[#fff9f3] dark:hover:bg-[#080808] transition-colors"
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
