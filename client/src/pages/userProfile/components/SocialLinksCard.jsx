import React, { memo, useMemo } from "react";
import useIcons from "../../../hooks/useIcons";

function SocialLinksCard({ socialLinks = {}, isSelf, onEdit }) {
  const icons = useIcons();

  const activeLinks = useMemo(() => {
    if (!socialLinks || typeof socialLinks !== "object") return [];

    const platforms = [
      { key: "website", label: "Website", icon: icons.globe, prefix: "" },
      { key: "github", label: "GitHub", icon: icons.github, prefix: "https://github.com/" },
      { key: "twitter", label: "X / Twitter", icon: icons.XCom, prefix: "https://x.com/" },
      { key: "linkedin", label: "LinkedIn", icon: icons.linkedin, prefix: "https://linkedin.com/in/" },
      { key: "substack", label: "Substack", icon: icons.book, prefix: "" },
      { key: "youtube", label: "YouTube", icon: icons.youtube, prefix: "" },
      { key: "discord", label: "Discord", icon: icons.discord, prefix: "" },
    ];

    return platforms
      .map((p) => {
        const val = socialLinks[p.key]?.trim();
        if (!val) return null;
        let url = val;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = p.prefix && !val.includes("/") ? `${p.prefix}${val}` : `https://${val}`;
        }
        return {
          ...p,
          url,
          displayValue: val.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        };
      })
      .filter(Boolean);
  }, [socialLinks, icons]);

  if (activeLinks.length === 0 && !isSelf) {
    return null;
  }

  return (
    <div className="w-full spread-card p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-stone-600 dark:text-stone-400 text-sm">
            {icons.link}
          </span>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider lustria">
            Connect
          </h3>
        </div>

        {isSelf && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit Links"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors shrink-0 cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>{icons.edit}</span>
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>

      {activeLinks.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {activeLinks.map((item) => (
            <a
              key={item.key}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800/80 border border-stone-200/60 dark:border-stone-800/60 transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-stone-600 dark:text-stone-400 text-base shrink-0 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                  {item.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-stone-100 truncate">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {item.displayValue}
                  </span>
                </div>
              </div>

              <span className="text-xs text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                {icons.arrowUpRight}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="py-2 text-center sm:text-left space-y-2">
          <p className="text-xs text-stone-500 dark:text-stone-400 italic">
            Add links to your website, GitHub, X, or Substack so readers can connect with you.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="spread-btn-secondary px-3.5 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer mt-1"
          >
            <span>{icons.plus}</span>
            <span>Add social links</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(SocialLinksCard);
