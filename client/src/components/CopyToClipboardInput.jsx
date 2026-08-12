import { useState, useCallback, useMemo } from "react";
import { Copy, Check } from "lucide-react";

const CopyToClipboardInput = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!item?.code) return;
    navigator.clipboard
      .writeText(item.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Copy error:", err));
  }, [item?.code]);

  const sanitizedCode = useMemo(() => item?.code || "", [item?.code]);
  const languageClass = useMemo(() => item?.lang || "javascript", [item?.lang]);

  return (
    <div className="w-full spread-card rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden backdrop-blur-xl bg-stone-900 text-stone-100 my-4">
      {/* Header Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/80 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-stone-600/80" />
            <div className="w-3 h-3 rounded-full bg-stone-500/80" />
            <div className="w-3 h-3 rounded-full bg-stone-400/80" />
          </div>
          <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider ml-2">
            {languageClass}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
        <pre className="whitespace-pre-wrap break-words font-mono text-stone-200">
          <code>{sanitizedCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default CopyToClipboardInput;
