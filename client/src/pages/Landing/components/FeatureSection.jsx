import { useEffect, useState } from "react";
import Heading from "./Heading";
import useIcons from "../../../hooks/useIcons";
import FeaturePreviewDispatcher from "./FeaturePreviews";

export default function FeatureSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const icons = useIcons();

  const features = [
    {
      id: "ai-assistant",
      badge: "AI Powered",
      title: "AI Post Assistant & Analysis",
      description:
        "Get instant structured executive summaries, key concept breakdowns, community sentiment scores, and interactive Q&A follow-up chats for every post.",
      tag: "Gemini 2.5 Flash Engine",
    },
    {
      id: "rich-editor",
      badge: "Rich Editor",
      title: "Dynamic Content & Code Editor",
      description:
        "Express your ideas with full markdown support, code blocks with syntax highlighting, inline figure embeds, and dynamic content formatting.",
      tag: "Developer-First",
    },
    {
      id: "security",
      badge: "Security",
      title: "OAuth 2.0 & Multi-Token Auth",
      description:
        "Seamless login with Google, GitHub, or secure encrypted token-based email authentication for peace of mind.",
      tag: "Secure & Encrypted",
    },
    {
      id: "personalization",
      badge: "Personalization",
      title: "Obsidian & Warm Paper Themes",
      description:
        "Experience Spread's signature warm paper (#fff9f3) light mode and sleek obsidian (#080808) dark mode tailored for reading comfort.",
      tag: "Eye Friendly",
    },
    {
      id: "organization",
      badge: "Organization",
      title: "Smart Bookmarks & Tag Explorer",
      description:
        "Organize favorite articles, follow trending topics, and quickly search through indexed tags and creator discussions.",
      tag: "Instant Discovery",
    },
    {
      id: "community",
      badge: "Community",
      title: "LinkedIn-Style Reactions & Follows",
      description:
        "React with Like, Cheer, Appreciate, and Celebration reactions, build your follower base, and engage with top creators.",
      tag: "Realtime Social",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, features.length]);

  return (
    <section
      id="features"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 overflow-hidden bg-transparent border-y border-inherit scroll-mt-12"
    >
      <div className="relative space-y-8 sm:space-y-12 max-w-6xl mx-auto border-inherit">
        {/* Section Header */}
        <Heading
          title={"Supercharged Features"}
          subtitle={
            "Everything you need to write, analyze, discover, and build your creative audience"
          }
        />

        {/* Feature Display Container */}
        <div
          className="relative min-h-[520px] sm:min-h-[500px] md:min-h-[460px] flex items-center justify-center border-inherit"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                currentIndex === index
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto z-10"
                  : "opacity-0 scale-95 translate-y-4 pointer-events-none z-0"
              }`}
            >
              <div className="spread-card rounded-3xl border border-inherit shadow-2xl p-5 sm:p-8 md:p-10 h-full flex flex-col justify-between overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center h-full">
                  {/* Text Content */}
                  <div className="space-y-3 sm:space-y-5 order-2 md:order-1">
                    <div className="flex items-center gap-2">
                      <span className="spread-pill text-[11px] sm:text-xs font-semibold">
                        {feature.badge}
                      </span>
                      <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                        • {feature.tag}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Preview Illustration / Interactive HTML Mockup */}
                  <div className="relative order-1 md:order-2 flex justify-center items-center w-full h-full">
                    <div className="relative w-full h-72 sm:h-80 md:h-[340px] rounded-2xl overflow-hidden spread-card border border-inherit flex items-center justify-center p-1 sm:p-2 shadow-xl">
                      <FeaturePreviewDispatcher featureId={feature.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-2">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setCurrentIndex(index)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all border border-inherit cursor-pointer ${
                currentIndex === index
                  ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 scale-105 shadow-sm"
                  : "bg-light dark:bg-dark text-stone-600 dark:text-stone-400 hover:bg-[#f5f1ec] dark:hover:bg-[#121212]"
              }`}
            >
              {feature.badge}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
