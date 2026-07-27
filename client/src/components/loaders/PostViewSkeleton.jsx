import React from "react";

function PostViewSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative flex justify-center items-start w-full h-screen overflow-auto px-4 py-8 sm:py-12 border-inherit animate-pulse"
    >
      <article className="max-w-3xl w-full flex flex-col gap-6">
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
      <span className="sr-only">Loading article...</span>
    </div>
  );
}

export default PostViewSkeleton;
