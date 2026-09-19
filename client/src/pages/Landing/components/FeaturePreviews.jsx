import { useState } from "react";
import useIcons from "../../../hooks/useIcons";

/**
 * 1. AI Post Assistant & Analysis Preview
 */
export function AiAssistantPreview() {
  const icons = useIcons();
  const [activeChip, setActiveChip] = useState(0);
  const chips = [
    { label: "⚡ Key takeaways", detail: "• Zero-latency client streaming\n• Automated semantic clustering\n• 35% higher reader retention" },
    { label: "💡 Explain simply", detail: "Spread decomposes technical architectures into concise executive summaries in < 200ms." },
    { label: "🔍 Fact check", detail: "Claims cross-verified against official Gemini 2.5 benchmarks and real-time telemetry." },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-stone-200 dark:border-stone-800 shadow-xl font-sans select-none overflow-hidden text-xs">
      {/* Minimalist Top Bar (X / Grok style) */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center text-xs shadow-xs">
            {icons.appreciate}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
              Spread Intelligence
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
              Gemini 2.5
            </span>
          </div>
        </div>
        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      </div>

      {/* Main Content Area */}
      <div className="space-y-2.5 my-auto py-1">
        {/* Executive Brief Box */}
        <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-[#121215] border border-stone-200/60 dark:border-stone-800/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              Executive Summary
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              96% match
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-normal line-clamp-2">
            Automates key architecture breakdowns, reader discussions, and sentiment scoring in real-time.
          </p>
        </div>

        {/* Community Sentiment Bar */}
        <div className="px-3 py-2 rounded-xl bg-stone-50/50 dark:bg-[#121215]/60 border border-stone-200/50 dark:border-stone-800/60 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
            <span className="text-emerald-500">{icons.grow}</span> Reception
          </span>
          <div className="flex-1 max-w-[120px] bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[94%]" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">94% Positive</span>
        </div>

        {/* Prompt Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveChip(idx)}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  activeChip === idx
                    ? "border-stone-900 bg-stone-900 text-stone-100 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-2xs"
                    : "border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 hover:border-stone-400"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <div className="p-2 rounded-lg bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200/50 dark:border-stone-800/60 text-[11px] text-stone-700 dark:text-stone-300 font-mono whitespace-pre-line leading-relaxed">
            {chips[activeChip].detail}
          </div>
        </div>
      </div>

      {/* Integrated Prompt Bar */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2">
        <div className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-[#151518] border border-stone-200/60 dark:border-stone-800/60 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Ask follow-ups or challenge ideas...</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-stone-200/60 dark:bg-stone-800 text-stone-500 font-mono">⌘K</span>
        </div>
        <div className="p-1.5 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs flex items-center justify-center cursor-pointer">
          {icons.sendFi}
        </div>
      </div>
    </div>
  );
}


/**
 * 2. Dynamic Content & Code Editor Preview
 */
export function RichEditorPreview() {
  const icons = useIcons();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#161618] text-stone-200 border border-stone-800 shadow-2xl font-mono select-none overflow-hidden text-xs">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-sans font-semibold text-stone-400 flex items-center gap-1.5 ml-1">
            <span className="text-cyan-400 text-xs">{icons.code1}</span>
            postEditor.tsx
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-100 transition-colors cursor-pointer bg-stone-800/80 px-2 py-0.5 rounded"
        >
          <span className="text-xs">{copied ? icons.check : icons.copy}</span>
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code / Markdown Canvas */}
      <div className="space-y-1.5 my-auto py-2 text-[11px] sm:text-xs leading-relaxed font-mono">
        <div className="flex items-center gap-2 text-stone-500 select-none text-[10px]">
          <span>01</span>
          <span className="text-rose-400 font-sans font-bold text-xs"># Building the Future with Spread</span>
        </div>
        <div className="flex items-center gap-2 text-stone-500 select-none text-[10px]">
          <span>02</span>
          <span className="text-stone-400 font-sans">Share your architecture with live interactive blocks:</span>
        </div>
        <div className="flex items-start gap-2 bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 text-[11px]">
          <span className="text-stone-600 select-none text-[10px]">03</span>
          <div className="space-y-0.5 overflow-x-auto no-scrollbar">
            <p>
              <span className="text-violet-400">export function</span>{" "}
              <span className="text-blue-400">PublishStory</span>() &#123;
            </p>
            <p className="pl-3">
              <span className="text-amber-400">const</span> story ={" "}
              <span className="text-emerald-400">&apos;⚡ Blazing Fast&apos;</span>;
            </p>
            <p className="pl-3">
              <span className="text-violet-400">return</span> &lt;
              <span className="text-cyan-300">SpreadCanvas</span> live=&#123;
              <span className="text-amber-400">true</span>&#125; /&gt;;
            </p>
            <p>&#125;</p>
          </div>
        </div>
      </div>

      {/* Floating Formatting Toolbar */}
      <div className="pt-2 border-t border-stone-800 flex items-center justify-between font-sans text-[11px]">
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold">H1</span>
          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold">Bold</span>
          <span className="px-2 py-0.5 rounded bg-stone-800 text-cyan-400 font-mono font-bold">&lt;/&gt;</span>
          <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-400 font-bold">Embed</span>
        </div>
        <span className="text-[10px] text-stone-500 font-mono">184 words • UTF-8</span>
      </div>
    </div>
  );
}

/**
 * 3. OAuth 2.0 & Multi-Token Auth Preview
 */
export function SecurityPreview() {
  const icons = useIcons();

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#fbf8f4] dark:bg-[#0d0d0d] border border-stone-200 dark:border-stone-800 shadow-inner font-sans select-none overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm">
            {icons.shieldCheck}
          </div>
          <div>
            <h4 className="font-bold text-[11px] sm:text-xs text-stone-900 dark:text-stone-100">
              Spread Secure Auth
            </h4>
            <p className="text-[10px] text-stone-500">OAuth 2.0 & Multi-Token</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
          256-Bit SSL
        </span>
      </div>

      {/* Auth Buttons Stack */}
      <div className="space-y-2 my-auto py-1">
        <button
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-stone-800 dark:text-stone-200 text-sm">{icons.google}</span>
            <span className="font-bold text-[11px] text-stone-800 dark:text-stone-200">
              Continue with Google
            </span>
          </div>
          <span className="text-[10px] font-semibold text-stone-400">1-Click</span>
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-stone-800 dark:text-stone-200 text-sm">{icons.github}</span>
            <span className="font-bold text-[11px] text-stone-800 dark:text-stone-200">
              Continue with GitHub
            </span>
          </div>
          <span className="text-[10px] font-semibold text-stone-400">OAuth</span>
        </button>
      </div>

      {/* Security Specs Footer */}
      <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 grid grid-cols-2 gap-2 text-[10px]">
        <div className="p-1.5 rounded-lg bg-stone-200/50 dark:bg-stone-900/60 border border-stone-300/40 dark:border-stone-800 flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
          <span className="text-emerald-500 font-bold">{icons.check}</span>
          <span>HttpOnly JWT</span>
        </div>
        <div className="p-1.5 rounded-lg bg-stone-200/50 dark:bg-stone-900/60 border border-stone-300/40 dark:border-stone-800 flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
          <span className="text-emerald-500 font-bold">{icons.check}</span>
          <span>CSRF Shielded</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 4. Obsidian & Warm Paper Themes Preview
 */
export function ThemePreview() {
  const icons = useIcons();
  const [selectedTheme, setSelectedTheme] = useState("both"); // 'both' | 'light' | 'dark'

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#fbf8f4] dark:bg-[#0d0d0d] border border-stone-200 dark:border-stone-800 shadow-inner font-sans select-none overflow-hidden text-xs">
      {/* Theme Switcher Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[11px] text-stone-900 dark:text-stone-100">
            Tailored Contrast
          </span>
          <span className="text-[10px] text-stone-500">Eye-Friendly</span>
        </div>
        <div className="flex items-center p-0.5 rounded-lg bg-stone-200/70 dark:bg-stone-800/80 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setSelectedTheme("light")}
            className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all ${
              selectedTheme === "light"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {icons.sun} Light
          </button>
          <button
            type="button"
            onClick={() => setSelectedTheme("dark")}
            className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all ${
              selectedTheme === "dark"
                ? "bg-stone-950 text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-200"
            }`}
          >
            {icons.moonFi} Dark
          </button>
          <button
            type="button"
            onClick={() => setSelectedTheme("both")}
            className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
              selectedTheme === "both"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            }`}
          >
            Split
          </button>
        </div>
      </div>

      {/* Side-by-Side or Full Preview */}
      <div className="grid grid-cols-2 gap-2 my-auto py-1 h-full max-h-[140px]">
        {/* Warm Paper Card */}
        {(selectedTheme === "both" || selectedTheme === "light") && (
          <div
            className={`p-3 rounded-xl bg-[#fff9f3] text-stone-900 border border-[#e3dacc] shadow-sm flex flex-col justify-between transition-all ${
              selectedTheme === "light" ? "col-span-2" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                  Warm Paper
                </span>
                <span className="text-[9px] font-mono text-stone-500">#fff9f3</span>
              </div>
              <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 leading-snug line-clamp-1">
                The Art of Writing
              </h5>
              <p className="text-[10px] text-stone-600 font-serif leading-relaxed line-clamp-2 mt-0.5">
                Gentle on the eyes for hours of immersed technical reading.
              </p>
            </div>
            <span className="text-[9px] font-bold text-stone-600 bg-[#f5f1ec] px-1.5 py-0.5 rounded w-fit">
              Serif Typography
            </span>
          </div>
        )}

        {/* Obsidian Dark Card */}
        {(selectedTheme === "both" || selectedTheme === "dark") && (
          <div
            className={`p-3 rounded-xl bg-[#080808] text-stone-100 border border-[#222222] shadow-sm flex flex-col justify-between transition-all ${
              selectedTheme === "dark" ? "col-span-2" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  Obsidian
                </span>
                <span className="text-[9px] font-mono text-stone-400">#080808</span>
              </div>
              <h5 className="font-sans font-extrabold text-xs sm:text-sm text-stone-100 leading-snug line-clamp-1">
                High-Contrast Dark
              </h5>
              <p className="text-[10px] text-stone-400 font-sans leading-relaxed line-clamp-2 mt-0.5">
                Deep black OLED canvas tuned for nighttime focus & syntax code.
              </p>
            </div>
            <span className="text-[9px] font-bold text-stone-300 bg-[#141414] px-1.5 py-0.5 rounded w-fit">
              OLED Deep Black
            </span>
          </div>
        )}
      </div>

      {/* Palette Swatches Bar */}
      <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500">
        <span>Instant 0ms flickerless CSS theme transition</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fff9f3] border border-[#e3dacc]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f5f1ec]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#121212]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#080808] border border-[#333]" />
        </div>
      </div>
    </div>
  );
}

/**
 * 5. Smart Bookmarks & Tag Explorer Preview
 */
export function BookmarksPreview() {
  const icons = useIcons();
  const [isBookmarked, setIsBookmarked] = useState(true);

  const tags = [
    { name: "#react", count: "3.2k" },
    { name: "#system-design", count: "1.8k" },
    { name: "#ai", count: "4.1k" },
    { name: "#typescript", count: "2.5k" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#fbf8f4] dark:bg-[#0d0d0d] border border-stone-200 dark:border-stone-800 shadow-inner font-sans select-none overflow-hidden text-xs">
      {/* Search Header */}
      <div className="pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400">
          <span className="text-xs">{icons.search}</span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            Search tags, folders & collections...
          </span>
        </div>
      </div>

      {/* Bookmarked Item Card */}
      <div className="my-auto py-1 space-y-2">
        <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Saved in AI Research
              </span>
              <span className="text-[10px] text-stone-400">• 5 min read</span>
            </div>
            <h5 className="font-bold text-[11px] sm:text-xs text-stone-900 dark:text-stone-100 line-clamp-1">
              Building Scalable Edge Microservices with Rust
            </h5>
          </div>

          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:scale-110 transition-transform cursor-pointer text-sm"
          >
            {isBookmarked ? icons.bookmarkFi : icons.bookmarkO}
          </button>
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-lg bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-[10px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1"
            >
              <span>{tag.name}</span>
              <span className="text-stone-400 font-mono text-[9px]">{tag.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Folders Bar */}
      <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500">
        <div className="flex items-center gap-1 text-stone-600 dark:text-stone-300 font-semibold">
          <span className="text-xs">{icons.folder}</span>
          <span>3 Custom Collections</span>
        </div>
        <span className="font-bold text-stone-700 dark:text-stone-300">+ New Folder</span>
      </div>
    </div>
  );
}

/**
 * 6. LinkedIn-Style Reactions & Follows Preview
 */
export function CommunityPreview() {
  const icons = useIcons();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeReaction, setActiveReaction] = useState("appreciate");
  const [reactionCounts, setReactionCounts] = useState({
    like: 142,
    cheer: 89,
    appreciate: 198,
    celebration: 54,
  });

  const handleReaction = (type) => {
    setActiveReaction(type);
    setReactionCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#fbf8f4] dark:bg-[#0d0d0d] border border-stone-200 dark:border-stone-800 shadow-inner font-sans select-none overflow-hidden text-xs">
      {/* Author Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            MC
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-[11px] sm:text-xs text-stone-900 dark:text-stone-100">
                Marcus Chen
              </span>
              <span className="text-[10px] text-amber-500 font-bold">★ PRO</span>
            </div>
            <p className="text-[10px] text-stone-500">Distributed Systems Lead</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFollowing((prev) => !prev)}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            isFollowing
              ? "bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              : "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs hover:scale-105"
          }`}
        >
          {isFollowing ? "Following ✓" : "+ Follow"}
        </button>
      </div>

      {/* Post Snippet */}
      <div className="my-auto py-1 space-y-2">
        <p className="text-[11px] sm:text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium line-clamp-2">
          &ldquo;Why we migrated our real-time messaging pipeline to SSE and Redis Streams in 2026.&rdquo;
        </p>

        {/* Reaction Action Bar */}
        <div className="p-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => handleReaction("like")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReaction === "like"
                ? "bg-blue-500/15 text-blue-600 font-bold scale-105"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            <span className="text-blue-500 text-xs">{icons.like}</span>
            <span className="text-[10px]">{reactionCounts.like}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction("cheer")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReaction === "cheer"
                ? "bg-emerald-500/15 text-emerald-600 font-bold scale-105"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            <span className="text-emerald-500 text-xs">{icons.cheer}</span>
            <span className="text-[10px]">{reactionCounts.cheer}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction("appreciate")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReaction === "appreciate"
                ? "bg-amber-500/15 text-amber-600 font-bold scale-105"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            <span className="text-amber-500 text-xs">{icons.appreciate}</span>
            <span className="text-[10px]">{reactionCounts.appreciate}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction("celebration")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReaction === "celebration"
                ? "bg-purple-500/15 text-purple-600 font-bold scale-105"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            <span className="text-purple-500 text-xs">{icons.celebration}</span>
            <span className="text-[10px]">{reactionCounts.celebration}</span>
          </button>
        </div>
      </div>

      {/* Engagement Stats Footer */}
      <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500">
        <span className="flex items-center gap-1">
          <span className="text-xs">{icons.message}</span>
          <span>48 Discussions</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-xs">{icons.share}</span>
          <span>1.8k Reads</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Main dispatcher component that renders the appropriate feature mockup
 */
export default function FeaturePreviewDispatcher({ featureId }) {
  switch (featureId) {
    case "ai-assistant":
      return <AiAssistantPreview />;
    case "rich-editor":
      return <RichEditorPreview />;
    case "security":
      return <SecurityPreview />;
    case "personalization":
      return <ThemePreview />;
    case "organization":
      return <BookmarksPreview />;
    case "community":
      return <CommunityPreview />;
    default:
      return <AiAssistantPreview />;
  }
}
