import React, { memo } from "react";
import { Link } from "react-router-dom";
import useIcons from "../../../hooks/useIcons";

function InterestsCard({ interests = [], skills = [], isSelf, onEdit }) {
  const icons = useIcons();

  const hasInterests = Array.isArray(interests) && interests.length > 0;
  const hasSkills = Array.isArray(skills) && skills.length > 0;

  if (!hasInterests && !hasSkills && !isSelf) {
    return null;
  }

  return (
    <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-stone-600 dark:text-stone-400 text-sm">
            {icons.hash}
          </span>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider lustria">
            Topics & Craft
          </h3>
        </div>

        {isSelf && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit Topics & Craft"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors shrink-0 cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>{icons.edit}</span>
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>

      {/* Areas of Interest */}
      {hasInterests && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Areas of Interest
          </h4>
          <div className="flex flex-wrap gap-2">
            {interests.map((tag, idx) => (
              <Link
                key={`interest-${idx}`}
                to={`/search?q=${encodeURIComponent(tag.replace(/^#/, ""))}`}
                className="spread-pill text-xs px-3 py-1 font-semibold hover:border-stone-400 dark:hover:border-stone-600 hover:scale-105 transition-all inline-flex items-center gap-1.5 group cursor-pointer"
              >
                <span className="text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                  #
                </span>
                <span>{tag.replace(/^#/, "")}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Craft & Skills */}
      {hasSkills && (
        <div className="space-y-2 pt-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Craft & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={`skill-${idx}`}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100/80 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 text-stone-800 dark:text-stone-200 inline-flex items-center gap-1.5"
              >
                <span className="text-[11px] text-stone-400">{icons.code1}</span>
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Profile Owner */}
      {!hasInterests && !hasSkills && isSelf && (
        <div className="py-2 text-center sm:text-left space-y-2">
          <p className="text-xs text-stone-500 dark:text-stone-400 italic">
            Add topics and craft tags so other members can discover your perspectives.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="spread-btn-secondary px-3.5 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer mt-1"
          >
            <span>{icons.plus}</span>
            <span>Add topics & craft</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(InterestsCard);
