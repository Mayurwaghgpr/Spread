import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";
import { Link } from "react-router-dom";

function Features() {
  const icons = useIcons();

  const featureList = [
    {
      title: "AI Post Assistant & Analysis",
      subtitle: "Powered by Google Gemini 2.5 Flash",
      description:
        "Instant structured executive summaries, key concept breakdowns, community sentiment scores, and interactive Q&A follow-up chats directly alongside any post.",
      icon: icons.appreciate,
      badge: "AI Intelligence",
    },
    {
      title: "Dynamic Content & Code Editor",
      subtitle: "Tailored for technical authors",
      description:
        "Full markdown formatting, interactive code blocks with language syntax highlighting, inline figure embeds, and reading duration estimates.",
      icon: icons.code1,
      badge: "Writing Suite",
    },
    {
      title: "Obsidian & Warm Paper Themes",
      subtitle: "Engineered for reading comfort",
      description:
        "Spread's signature warm paper (#fff9f3) light mode and sleek obsidian (#09090b) dark mode reduce eye strain during extended deep-work reading sessions.",
      icon: icons.moonFi,
      badge: "Design Tokens",
    },
    {
      title: "GitHub Sync Integration",
      subtitle: "Publish from git commit workflows",
      description:
        "Connect your GitHub repositories to automatically publish `.md` documentation files as Spread articles whenever you push to main.",
      icon: icons.gitBranch,
      badge: "DevOps Integration",
    },
    {
      title: "LinkedIn-Style Rich Reactions",
      subtitle: "Community sentiment beyond simple likes",
      description:
        "React with Like, Cheer, Appreciate, and Celebration reactions. Gain detailed breakdown insights on how readers engage with your articles.",
      icon: icons.celebration,
      badge: "Social Graph",
    },
    {
      title: "Smart Bookmarks & Topic Explorer",
      subtitle: "Custom reading lists and discovery",
      description:
        "Group articles into custom reading folders, track read progress, and explore indexed tags across the creator ecosystem.",
      icon: icons.bookmarkFi,
      badge: "Content Curation",
    },
  ];

  return (
    <InfoPageLayout
      badge="Platform Capabilities"
      badgeIcon={icons.bolt}
      title="Platform Features"
      subtitle="Discover the complete suite of writing, AI analysis, and community tools built into Spread."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featureList.map((item, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-stone-200/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 text-base">
                  {item.icon}
                </span>
                <span className="spread-pill text-[10px] font-bold">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 pt-1">
                {item.title}
              </h3>
              <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                {item.subtitle}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-3">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Ready to experience Spread?
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Sign up free today to start writing stories and exploring AI post insights.
        </p>
        <div className="pt-2">
          <Link
            to="/auth/signup"
            className="spread-btn-primary px-5 py-2 rounded-full text-xs font-bold inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(Features);
