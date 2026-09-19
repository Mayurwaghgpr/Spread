import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";

function TermsOfService() {
  const icons = useIcons();

  return (
    <InfoPageLayout
      badge="Legal & Compliance"
      badgeIcon={icons.docTab}
      title="Terms of Service"
      subtitle="Rules, user agreements, and acceptable publishing standards for Spread."
      lastUpdated="September 19, 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          1. Agreement to Terms
        </h2>
        <p>
          By creating an account, browsing public stories, or publishing articles on Spread, you agree to comply with these Terms of Service. If you disagree with any part of these terms, you must discontinue using the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          2. Content Standards & Acceptable Use
        </h2>
        <p>
          Spread is built for thoughtful discussion, knowledge sharing, and technical storytelling. When publishing, you agree not to:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-600 dark:text-stone-400 p-4 rounded-2xl bg-stone-100/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
          <li>Post malicious code, viruses, or phishing exploits.</li>
          <li>Engage in harassment, hate speech, or targeted defamation.</li>
          <li>Infringe on trademarks, copyrights, or proprietary intellectual property.</li>
          <li>Execute automated scraping or DDoS attacks that impair platform availability.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          3. Author Intellectual Property
        </h2>
        <p>
          You own the content you publish on Spread. By posting, you grant Spread a non-exclusive, worldwide, royalty-free license to host, display, index, and format your content for platform readers and search crawlers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          4. AI-Generated Output & Attribution
        </h2>
        <p>
          Spread allows authors to leverage AI assistant tools. Authors are responsible for verifying the accuracy of any code snippets or claims generated using platform AI helpers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          5. Termination & Suspension
        </h2>
        <p>
          Spread reserves the right to suspend or terminate accounts that repeatedly violate community safety standards or attempt to exploit system vulnerabilities.
        </p>
      </section>
    </InfoPageLayout>
  );
}

export default memo(TermsOfService);
