import React from "react";

function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full p-5 sm:p-6 rounded-xl border border-[#d8cebe] dark:border-[#2a2a2a] bg-laccent/40 dark:bg-daccent/40 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-laccent dark:bg-gray-800 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="w-28 h-3.5 rounded bg-laccent dark:bg-gray-800" />
          <div className="w-16 h-2.5 rounded bg-gray-200/80 dark:bg-gray-800/60" />
        </div>
      </div>
      {/* Title skeleton */}
      <div className="w-3/4 h-5 rounded bg-laccent dark:bg-gray-800 my-1" />
      {/* Excerpt skeleton */}
      <div className="flex flex-col gap-2">
        <div className="w-full h-3 rounded bg-gray-200/80 dark:bg-gray-800/60" />
        <div className="w-5/6 h-3 rounded bg-gray-200/80 dark:bg-gray-800/60" />
      </div>
      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-[#d8cebe]/40 dark:border-[#2a2a2a]/60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-4 rounded bg-gray-200/80 dark:bg-gray-800/60" />
          <div className="w-12 h-4 rounded bg-gray-200/80 dark:bg-gray-800/60" />
        </div>
        <div className="w-6 h-6 rounded bg-gray-200/80 dark:bg-gray-800/60" />
      </div>
    </div>
  );
}

export default PostCardSkeleton;
