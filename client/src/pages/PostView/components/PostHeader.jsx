import { Link } from "react-router-dom";
import ProfileImage from "../../../components/ProfileImage";
import Follow from "../../../components/buttons/follow";
import FormatedTime from "../../../components/utilityComp/FormatedTime";
import { memo, useMemo } from "react";

const PostHeader = memo(({ postView, userImageurl }) => {
  const usernameSlug = useMemo(() => {
    const username = postView?.author?.username || "";
    const parts = username.trim().split(" ");
    return parts.length > 1 ? parts.slice(0, -1).join("") : username;
  }, [postView?.author?.username]);

  return (
    <header className="w-full space-y-5">
      {/* Author & Follow Bar */}
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/profile/@${usernameSlug}/${postView?.author?.id}`}
            className="shrink-0 group focus-ring rounded-full"
          >
            <ProfileImage
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-200 dark:border-stone-800 object-cover group-hover:opacity-80 transition-opacity"
              image={userImageurl}
              alt={postView?.author?.username}
              title="Author profile"
            />
          </Link>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profile/@${usernameSlug}/${postView?.author?.id}`}
                className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 hover:underline truncate"
              >
                {postView?.author?.displayName || postView?.author?.username || "Unknown Author"}
              </Link>
              {postView?.author?.username && (
                <span className="text-xs text-stone-400 font-normal">
                  @{postView.author.username}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
              <FormatedTime
                date={postView?.createdAt}
                formate="d LLL yyy"
              />
              <span>•</span>
              <span>Published</span>
            </div>
          </div>
        </div>

        {postView?.author && (
          <Follow
            person={postView.author}
            className="shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full"
          />
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2 pt-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-tight sm:leading-snug">
          {postView?.title}
        </h1>
        {postView?.subtitle && (
          <p className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-stone-400 font-normal leading-relaxed">
            {postView.subtitle}
          </p>
        )}
      </div>
    </header>
  );
});

export default PostHeader;
