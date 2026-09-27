import React from "react";
import useIcons from "../../../hooks/useIcons";

function EncryptionNoticeBanner({ onOpenDetails }) {
  const icons = useIcons();

  return (
    <div className="flex justify-center w-full my-4 px-4 select-none">
      <div className="max-w-md w-full spread-card rounded-2xl border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/5 dark:bg-amber-400/5 p-3.5 text-center shadow-xs backdrop-blur-xs transition-all hover:border-amber-500/30">
        <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs mb-1">
          <span className="text-xs">{icons.lock}</span>
          <span>End-to-End Encrypted</span>
        </div>
        <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
          Messages in this chat are secured with end-to-end encryption. No one outside of this chat, not even Spread, can read them.{" "}
          <button
            type="button"
            onClick={onOpenDetails}
            className="inline text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
          >
            Learn more
          </button>
        </p>
      </div>
    </div>
  );
}

export default React.memo(EncryptionNoticeBanner);
