import React, { memo } from "react";
import useIcons from "../../../hooks/useIcons";
import AbbreviateNumber from "../../../utils/components/AbbreviateNumber";
import FormatedTime from "../../../components/utilityComp/FormatedTime";

function CreatorSnapshotCard({ creatorStats, createdAt, postsCount }) {
  const icons = useIcons();

  const totalStories = creatorStats?.totalPosts ?? postsCount ?? 0;
  const totalLikes = creatorStats?.totalLikes ?? 0;
  const joinedDate = creatorStats?.memberSince || createdAt;

  return (
    <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-sm">{icons.trophy}</span>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider lustria">
            Creator Snapshot
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Stories Published */}
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-semibold">Stories</span>
            <span className="text-sm">{icons.post}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-2">
            <AbbreviateNumber rawNumber={totalStories} />
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-0.5">
            published on Spread
          </span>
        </div>

        {/* Total Appreciations / Likes */}
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-semibold">Sparks</span>
            <span className="text-sm">{icons.flame}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-2">
            <AbbreviateNumber rawNumber={totalLikes} />
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-0.5">
            community likes
          </span>
        </div>
      </div>

      {/* Community Tenure */}
      {joinedDate && (
        <div className="pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span>{icons.calender}</span>
            <span>Writer on Spread since</span>
          </span>
          <span className="font-bold text-stone-800 dark:text-stone-200">
            <FormatedTime date={joinedDate} formate="MMMM yyyy" />
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(CreatorSnapshotCard);
