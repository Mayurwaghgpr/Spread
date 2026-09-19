import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";

function PrivacyPolicy() {
  const icons = useIcons();

  return (
    <InfoPageLayout
      badge="Legal & Compliance"
      badgeIcon={icons.shieldCheck}
      title="Privacy Policy"
      subtitle="How Spread collects, protects, processes, and respects your personal information."
      lastUpdated="September 19, 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          1. Introduction & Core Principles
        </h2>
        <p>
          Spread (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates a modern publishing and discussion platform for software engineers, designers, and creators. We prioritize data minimization, complete transparency, and user privacy rights. We do not sell your personal data to third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          2. Information We Collect
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
              Account Credentials
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400">
              Your name, username, email address, and avatar image when you register via Google OAuth, GitHub, or email authentication.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
              Published Content
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400">
              Articles, code blocks, comments, bookmarks, and reactions you explicitly author or interact with on the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          3. Artificial Intelligence Processing (Gemini AI)
        </h2>
        <p>
          Spread integrates Google Gemini 2.5 Flash models to provide instantaneous executive summaries, code analysis, and audience sentiment breakdowns.
        </p>
        <div className="p-4 rounded-2xl bg-stone-100/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
          <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
            <li>Only published article text submitted for analysis is forwarded to the AI API endpoint.</li>
            <li>We do not share your private passwords, private messages, or uncommitted drafts with AI model providers.</li>
            <li>AI responses are streamed in real-time and cached to optimize platform responsiveness.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          4. Cookies & Session Storage
        </h2>
        <p>
          We employ strictly necessary secure authentication cookies (`AccessToken`, `RefreshToken`) and browser local storage for interface preferences (such as Obsidian vs. Warm Paper theme modes and layout scaling).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          5. Data Ownership & Deletion
        </h2>
        <p>
          You retain 100% intellectual property rights over all stories and code you publish on Spread. You may edit, unpublish, or delete your posts and account profile at any time directly through your account settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          6. Contact Information
        </h2>
        <p>
          For questions regarding this privacy policy or to submit a data erasure request, contact us at{" "}
          <a
            href="mailto:privacy@spreadplatform.com"
            className="text-stone-900 dark:text-stone-100 font-bold underline"
          >
            privacy@spreadplatform.com
          </a>.
        </p>
      </section>
    </InfoPageLayout>
  );
}

export default memo(PrivacyPolicy);
