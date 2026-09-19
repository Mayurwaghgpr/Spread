import { memo, useState } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";

function HelpCenter() {
  const icons = useIcons();
  const [openFaq, setOpenFaq] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");

  const faqs = [
    {
      q: "How does the Gemini AI post assistant work?",
      a: "When viewing any story or editing a draft, click the AI Intelligence pill to open the side drawer. Spread connects directly to Google Gemini 2.5 Flash to generate executive summaries, key takeaways, sentiment analysis, or answer ad-hoc questions about the article.",
    },
    {
      q: "How can I sync articles directly from GitHub?",
      a: "Go to Settings > GitHub Sync. Connect your repository to automatically format Markdown files and commit updates directly into published Spread stories.",
    },
    {
      q: "What formatting tools are available in the editor?",
      a: "Spread's dynamic editor supports standard Markdown syntax, interactive code blocks with language syntax highlighting, inline media attachments, tags, and reading duration calculations.",
    },
    {
      q: "How do LinkedIn-style reactions work?",
      a: "You can express yourself beyond simple likes with Like, Cheer, Appreciate, and Celebration reactions. Reactions appear in real time on the author's feed and contribute to trending rankings.",
    },
    {
      q: "Is Spread free to use?",
      a: "Yes! Reading, publishing, AI post insights, and community interactions on Spread are completely free for all creators and developers.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.a.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <InfoPageLayout
      badge="Support & Documentation"
      badgeIcon={icons.info}
      title="Help Center"
      subtitle="Find answers, explore guides, and learn how to get the most out of Spread."
    >
      {/* Search Input Box */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <span className="text-sm">{icons.search}</span>
        </div>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search questions or topics..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-500/20 transition-all"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-base text-stone-800 dark:text-stone-200">{icons.penFi}</span>
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
            Writing & Formatting
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Markdown tags, syntax highlighting, and media uploads.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-base text-stone-800 dark:text-stone-200">{icons.appreciate}</span>
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
            AI Assistant
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Post analysis, interactive chats, and summaries.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-base text-stone-800 dark:text-stone-200">{icons.shieldCheck}</span>
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
            Account & Security
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            OAuth logins, profile customization, and session controls.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-stone-200/40 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="shrink-0 text-xs text-stone-400">
                    {isOpen ? icons.arrowUp : icons.arrowDown}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-200/60 dark:border-stone-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(HelpCenter);
