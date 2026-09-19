import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";

function Blog() {
  const icons = useIcons();

  const articles = [
    {
      date: "September 19, 2026",
      version: "v1.2.0",
      title: "Introducing Obsidian & Warm Paper Design System 2.0",
      summary:
        "A deep dive into our refined micro-interaction tokens, elimination of layout lag, standardized icon system, and modern typography.",
      author: "Mayur Wagh",
    },
    {
      date: "August 24, 2026",
      version: "v1.1.0",
      title: "Architecture of Spread's AI Assistant with Google Gemini 2.5",
      summary:
        "How we implemented real-time Server-Sent Events (SSE) streaming for post summaries, sentiment gauges, and follow-up interactive chats.",
      author: "Mayur Wagh",
    },
    {
      date: "July 12, 2026",
      version: "v1.0.0",
      title: "Welcome to Spread: The Story Behind the Platform",
      summary:
        "Why we set out to build an uncluttered, developer-first publishing home where thoughtful technical stories take center stage.",
      author: "Mayur Wagh",
    },
  ];

  return (
    <InfoPageLayout
      badge="Engineering & Changelog"
      badgeIcon={icons.post}
      title="Spread Official Blog"
      subtitle="Product announcements, technical deep dives, and release notes from the Spread engineering team."
    >
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Recent Platform Updates
        </h2>

        <div className="space-y-4">
          {articles.map((item, idx) => (
            <article
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-[10px]">
                  {item.version}
                </span>
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  {item.date}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.summary}
              </p>

              <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 font-medium border-t border-stone-200 dark:border-stone-800">
                <span>Written by</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {item.author}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(Blog);
