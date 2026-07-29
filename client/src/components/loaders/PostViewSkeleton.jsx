import React from "react";

function PostViewSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative flex justify-end items-start w-full h-screen overflow-auto px-2 sm:py-10 py-5 border-inherit animate-pulse"
    >
      <article className="max-w-4xl w-full sm:px-4 px-2 flex flex-col gap-6 border-inherit">
        {/* Author Header Skeleton */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200/60 dark:border-gray-800/80">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-36 h-4 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="w-24 h-3 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="w-20 h-8 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0" />
        </div>

        {/* Title & Subtitle Skeleton */}
        <div className="flex flex-col gap-3 my-2">
          <div className="w-full h-8 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="w-4/5 h-8 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="w-3/4 h-5 rounded bg-gray-200 dark:bg-gray-800 mt-2" />
        </div>

        {/* Cover Image Skeleton */}
        <div className="w-full h-64 sm:h-96 rounded-2xl bg-gray-300 dark:bg-gray-700 my-2" />

        {/* Paragraph Skeletons */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="w-5/6 h-4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="w-4/5 h-4 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </article>

      {/* Author profile skeleton */}
      <div className="relative sm:flex hidden flex-col gap-4 p-5 w-full max-w-sm border rounded-lg border-inherit bg-light dark:bg-dark">
        <div className="flex items-start justify-between gap-2 w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-300 dark:bg-gray-700 rounded-full shrink-0"></div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        <div className="flex gap-6 pt-4 border-t border-gray-200 dark:border-gray-800 w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
        </div>
      </div>

      <span className="sr-only">Loading article...</span>
    </div>
  );
}

export default PostViewSkeleton;
