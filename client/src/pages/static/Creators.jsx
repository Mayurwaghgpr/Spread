import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";
import { Link } from "react-router-dom";

function Creators() {
  const icons = useIcons();

  const benefits = [
    {
      title: "Realtime Gemini AI Insights",
      description:
        "Every story you publish automatically unlocks AI-assisted executive summaries, code breakdown tables, and audience reaction sentiment analysis.",
      icon: icons.appreciate,
    },
    {
      title: "Developer-First Markdown & Code",
      description:
        "Write with seamless markdown syntax, rich interactive code blocks, language syntax highlighting, and copy-paste chrome utilities.",
      icon: icons.code1,
    },
    {
      title: "GitHub Repository Syncing",
      description:
        "Keep your technical posts in sync with Git commits. Format READMEs and docs into published articles automatically.",
      icon: icons.gitBranch,
    },
    {
      title: "Direct Audience Connection",
      description:
        "Grow followers, converse in direct and group chats, and receive real-time reactions and comments from an engaged community.",
      icon: icons.people,
    },
  ];

  return (
    <InfoPageLayout
      badge="For Creators & Developers"
      badgeIcon={icons.person}
      title="Write, Publish, & Grow on Spread"
      subtitle="The modern publishing home for software engineers, tech writers, and creative minds."
    >
      {/* Hero Pitch Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-stone-100 shadow-2xl space-y-4">
        <span className="spread-pill text-xs px-3 py-1 bg-stone-800/80 border-stone-700 text-amber-400">
          Zero Algorithms • Pure Content
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Your words deserve an exceptional reading experience.
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
          Say goodbye to cluttered ad networks and paywalls. Spread provides a clean, Obsidian and Warm Paper reading interface where content is the hero.
        </p>
        <div className="pt-2">
          <Link
            to="/auth/signup"
            className="spread-btn-primary px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2"
          >
            <span>Start Writing Today</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Why Top Engineers & Writers Choose Spread
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-stone-200/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 text-base">
                  {item.icon}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(Creators);
