import React, { memo, useState, useMemo } from "react";
import useIcons from "../../../hooks/useIcons";

function AboutStoryCard({ aboutStory, bio, displayName, isSelf, onEdit }) {
  const icons = useIcons();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayStory = aboutStory || bio;
  const isTruncatable = useMemo(() => {
    return displayStory && displayStory.length > 380;
  }, [displayStory]);

  const formattedContent = useMemo(() => {
    if (!displayStory) return "";
    if (isTruncatable && !isExpanded) {
      return displayStory.slice(0, 360) + "...";
    }
    return displayStory;
  }, [displayStory, isTruncatable, isExpanded]);

  if (!displayStory && !isSelf) {
    return (
      <div className="w-full spread-card p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 lustria">
          About {displayName}
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic">
          No detailed story shared yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full spread-card p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 relative">
      <div className="flex items-center justify-between gap-4 border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-stone-600 dark:text-stone-400 text-sm">
            {icons.fetherFi}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 lustria tracking-tight">
            The Story
          </h2>
        </div>

        {isSelf && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit Story"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors shrink-0 cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>{icons.edit}</span>
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>

      {displayStory ? (
        <div className="space-y-3">
          <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed nunito whitespace-pre-line break-words">
            {formattedContent}
          </div>

          {isTruncatable && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 dark:text-stone-100 hover:underline pt-1 cursor-pointer"
            >
              <span>{isExpanded ? "Read less" : "Read more"}</span>
              <span className="text-xs">
                {isExpanded ? icons.arrowUp : icons.arrowDown}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="py-4 text-center sm:text-left space-y-2">
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic">
            You haven't added an extended story yet. Share your journey, ideas, and what you write about on Spread.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="spread-btn-secondary px-4 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <span>{icons.plus}</span>
            <span>Write your story</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(AboutStoryCard);
