import React, { memo } from "react";
import { Link } from "react-router-dom";
import useIcons from "../../../hooks/useIcons";
import FormatedTime from "../../../components/utilityComp/FormatedTime";
import AbbreviateNumber from "../../../utils/components/AbbreviateNumber";

function FeaturedPostCard({ pinnedPost, username, isSelf, onSelectPost }) {
  const icons = useIcons();

  if (!pinnedPost && !isSelf) {
    return null;
  }

  if (!pinnedPost && isSelf) {
    return (
      <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700/80 flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
          <span className="text-base">{icons.pin}</span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Featured Story
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Pin a standout story to the top of your About page to give new readers an immediate introduction to your voice.
        </p>
        <button
          type="button"
          onClick={onSelectPost}
          className="spread-btn-secondary px-4 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer mt-1"
        >
          <span>{icons.plus}</span>
          <span>Select featured story</span>
        </button>
      </div>
    );
  }

  const postUrl = `/view/@${username}/${pinnedPost?.id}`;
  const likesCount = pinnedPost?.Likes?.length || 0;
  const commentsCount = pinnedPost?.comments?.length || 0;

  return (
    <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 group transition-all duration-200 hover:border-stone-400 dark:hover:border-stone-600">
      {/* Header bar: Badge and actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[11px] font-extrabold uppercase tracking-wider">
          <span className="text-xs">{icons.pin}</span>
          <span>Featured Story</span>
        </div>

        {isSelf && (
          <button
            type="button"
            onClick={onSelectPost}
            className="text-[11px] font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{icons.edit}</span>
            <span>Change</span>
          </button>
        )}
      </div>

      {/* Main Story Content */}
      <Link to={postUrl} className="block group/link space-y-3">
        <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover/link:text-amber-600 dark:group-hover/link:text-amber-400 transition-colors lustria line-clamp-2">
              {pinnedPost?.title}
            </h3>

            {pinnedPost?.subtitle && (
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 nunito line-clamp-2 leading-relaxed">
                {pinnedPost.subtitle}
              </p>
            )}
          </div>

          {pinnedPost?.previewImage && (
            <div className="w-full sm:w-28 sm:h-20 h-44 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0 border border-stone-200/60 dark:border-stone-800/60">
              <img
                src={pinnedPost.previewImage}
                alt={pinnedPost?.title || "Featured post"}
                className="w-full h-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Footer info: date and stats */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800/60">
          <div className="flex items-center gap-3">
            {pinnedPost?.createdAt && (
              <span className="flex items-center gap-1">
                <span>{icons.calender}</span>
                <FormatedTime date={pinnedPost.createdAt} formate="MMM d, yyyy" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-xs">{icons.like}</span>
              <span><AbbreviateNumber rawNumber={likesCount} /></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-xs">{icons.comment}</span>
              <span><AbbreviateNumber rawNumber={commentsCount} /></span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default memo(FeaturedPostCard);
