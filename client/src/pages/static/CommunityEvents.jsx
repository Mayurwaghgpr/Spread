import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";

function CommunityEvents() {
  const icons = useIcons();

  const events = [
    {
      date: "October 14, 2026",
      time: "5:00 PM UTC",
      type: "Live Workshop",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      title: "Building Real-time AI Applications with Gemini & SSE",
      host: "Spread Engineering Team",
      desc: "An end-to-end interactive session detailing our SSE event piping architecture and UI token streaming pipeline.",
    },
    {
      date: "October 28, 2026",
      time: "6:30 PM UTC",
      type: "Community AMA",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      title: "From Developer to Technical Author: Growing Your Voice",
      host: "Featured Creator Panel",
      desc: "Top technical authors share strategies for turning code commits and architectural challenges into high-impact blog posts.",
    },
    {
      date: "November 15, 2026",
      time: "All Day",
      type: "Global Hackathon",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      title: "Spread Hack 2026: Open Source Integrations",
      host: "Open Source Collective",
      desc: "Collaborate with fellow creators to build new plugins, Markdown formatting tools, and theme themes for Spread.",
    },
  ];

  return (
    <InfoPageLayout
      badge="Meetups & Hackathons"
      badgeIcon={icons.calender}
      title="Events & Community"
      subtitle="Join live sessions, creator AMAs, and hackathons hosted across the Spread developer network."
    >
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Upcoming Schedule
        </h2>

        <div className="space-y-3.5">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${event.badgeColor}`}>
                    {event.type}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {event.date} • {event.time}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                  Host: {event.host}
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                {event.title}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {event.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(CommunityEvents);
