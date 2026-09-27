import React, { memo } from "react";
import useIcons from "../../../hooks/useIcons";

function AiThemesCard({ aiProfileSummary, isSelf, onGenerateOrEdit, isGenerating }) {
  const icons = useIcons();

  const hasSummary = Boolean(aiProfileSummary?.summary);
  const writingThemes = Array.isArray(aiProfileSummary?.writingThemes)
    ? aiProfileSummary.writingThemes
    : [];

  if (!hasSummary && !isSelf) {
    return null;
  }

  return (
    <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 relative overflow-hidden bg-gradient-to-br from-stone-50/50 to-white/80 dark:from-stone-900/40 dark:to-[#111114]/90">
      {/* Top accent badge */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-sm">
            {icons.appreciate}
          </span>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider lustria">
            Themes in Writing
          </h3>
        </div>

        {isSelf && (
          <button
            type="button"
            onClick={onGenerateOrEdit}
            disabled={isGenerating}
            title={hasSummary ? "Regenerate Themes" : "Discover Themes"}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{icons.sparkles}</span>
            <span>{hasSummary ? "Regenerate" : "Discover Themes"}</span>
          </button>
        )}
      </div>

      {hasSummary ? (
        <div className="space-y-3.5">
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 nunito leading-relaxed italic">
            "{aiProfileSummary.summary}"
          </p>

          {writingThemes.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {writingThemes.map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          {/* Transparency note */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500 pt-1">
            <span className="text-xs">{icons.infoCircle}</span>
            <span>Synthesized by Spread AI from published stories • Approved by author</span>
          </div>
        </div>
      ) : (
        <div className="py-2 text-center sm:text-left space-y-2">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Let Spread AI analyze your published stories to synthesize recurring themes and craft an editorial perspective for your profile.
          </p>
          <button
            type="button"
            onClick={onGenerateOrEdit}
            disabled={isGenerating}
            className="spread-btn-secondary px-3.5 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer mt-1"
          >
            <span>{icons.sparkles}</span>
            <span>{isGenerating ? "Analyzing stories..." : "Generate writing themes"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(AiThemesCard);
