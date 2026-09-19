import { memo } from "react";
import InfoPageLayout from "./static/components/InfoPageLayout";
import useIcons from "../hooks/useIcons";

const About = () => {
  const icons = useIcons();

  return (
    <InfoPageLayout
      badge="About Spread"
      badgeIcon={icons.info}
      title="The Spread Story"
      subtitle="A modern social publishing platform built to empower developers, writers, and curious minds."
    >
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Our Mission
        </h2>
        <p>
          At Spread, our mission is to create a platform where people can read and write inspiring technical and creative stories, share their architectural experiences, and connect through meaningful content. We believe in the power of clear storytelling to educate, spark conversations, and bring developer communities together.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Who We Are
        </h2>
        <p>
          Spread is developed with passion and dedication by Mayur Wagh. It was engineered from the ground up as a developer-first social network, combining real-time streaming AI assistance, Markdown syntax parsing, LinkedIn-style reactions, and tailored Obsidian/Warm Paper themes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          What Sets Spread Apart
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              Gemini AI Integration
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Instant executive summaries, concept breakdowns, and real-time interactive Q&A for every article.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              Zero Clutter Reading
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              No distracting popups or third-party ad networks. Just beautifully formatted typography and code.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Connect With the Developer
        </h2>
        <p>
          Have questions, architectural feedback, or feature ideas? Connect directly on LinkedIn or GitHub:
        </p>
        <div className="flex items-center gap-3 pt-2">
          <a
            href="https://www.linkedin.com/in/mayur-wagh-751b8a24b"
            target="_blank"
            rel="noopener noreferrer"
            className="spread-pill text-xs px-3.5 py-1.5 flex items-center gap-1.5 font-bold"
          >
            <span>{icons.linkedin}</span>
            <span>LinkedIn Profile</span>
          </a>
          <a
            href="https://github.com/Mayurwaghgpr/Spread"
            target="_blank"
            rel="noopener noreferrer"
            className="spread-pill text-xs px-3.5 py-1.5 flex items-center gap-1.5 font-bold"
          >
            <span>{icons.github}</span>
            <span>GitHub Repository</span>
          </a>
        </div>
      </section>
    </InfoPageLayout>
  );
};

export default memo(About);
