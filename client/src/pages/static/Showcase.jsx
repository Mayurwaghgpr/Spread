import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";
import { Link } from "react-router-dom";

function Showcase() {
  const icons = useIcons();

  const showcases = [
    {
      title: "Building Micro-Frontends with Vite & Module Federation",
      author: "Alex Rivera",
      handle: "@arivera",
      tags: ["React", "Vite", "Architecture"],
      readTime: "6 min read",
      reactions: "184",
    },
    {
      title: "Optimizing PostgreSQL Indices for High-Throughput Pipelines",
      author: "Elena Rostov",
      handle: "@erostov",
      tags: ["Database", "SQL", "Backend"],
      readTime: "9 min read",
      reactions: "342",
    },
    {
      title: "Zero-Cost Streaming LLM UIs using Server-Sent Events",
      author: "Mayur Wagh",
      handle: "@mayurwagh",
      tags: ["GeminiAI", "SSE", "Fullstack"],
      readTime: "8 min read",
      reactions: "512",
    },
    {
      title: "Crafting High-Performance Vanilla CSS Micro-Design Systems",
      author: "Sarah Chen",
      handle: "@schen",
      tags: ["CSS", "DesignSystems", "UI"],
      readTime: "5 min read",
      reactions: "228",
    },
  ];

  return (
    <InfoPageLayout
      badge="Community Highlights"
      badgeIcon={icons.celebration}
      title="Community Showcase"
      subtitle="Discover trending technical stories, engineering breakdowns, and creative ideas published on Spread."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
            Featured Creator Articles
          </h2>
          <Link
            to="/search"
            className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
          >
            <span>Search All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showcases.map((post, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-snug">
                  {post.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="font-bold text-stone-800 dark:text-stone-200">{post.author}</span>
                  <span>{post.handle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-rose-500">
                    {icons.redHeartFi} {post.reactions}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(Showcase);
