import React, { memo } from "react";
import useIcons from "../../../hooks/useIcons";

function CurrentFocusCard({ currentFocus, isSelf, onEdit }) {
  const icons = useIcons();

  if (!currentFocus && !isSelf) {
    return null;
  }

  return (
    <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 relative overflow-hidden group">
      {/* Subtle accent glow */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500/80 via-orange-500/80 to-stone-500/50" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span>{icons.compass}</span>
              <span>Current Focus</span>
            </span>
          </div>

          {currentFocus ? (
            <p className="text-sm sm:text-base font-medium text-stone-800 dark:text-stone-100 leading-relaxed break-words nunito">
              {currentFocus}
            </p>
          ) : (
            <div className="py-2">
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic">
                Share what you are currently researching, building, or learning.
              </p>
              <button
                type="button"
                onClick={onEdit}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                <span>{icons.plus}</span>
                <span>Add your current focus</span>
              </button>
            </div>
          )}
        </div>

        {isSelf && currentFocus && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit Current Focus"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors shrink-0 cursor-pointer"
          >
            <span className="text-xs">{icons.edit}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(CurrentFocusCard);
