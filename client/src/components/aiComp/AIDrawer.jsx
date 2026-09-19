import { useState, useEffect, useRef, memo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useIcons from "../../hooks/useIcons";
import useAiApi from "../../services/useAiApi";

const DEFAULT_PROMPT_CHIPS = [
  { label: "⚡ Key takeaways", prompt: "What are the practical takeaways and key action items from this post?" },
  { label: "💡 Explain simply", prompt: "Explain the core ideas of this post in simple terms for a beginner." },
  { label: "🔍 Technical critique", prompt: "What are the architectural trade-offs, limitations, or alternatives to the approach described?" },
  { label: "💬 Community sentiment", prompt: "Summarize the community sentiment and reader perspective on this topic." },
];

const AIDrawer = ({ isOpen, onClose, postData }) => {
  const icons = useIcons();
  const { fetchAIAnalysisStream, fetchAIChatStream } = useAiApi();

  const [activeTab, setActiveTab] = useState("summary"); // 'summary' | 'chat'
  const [streamRawText, setStreamRawText] = useState("");
  const [isCached, setIsCached] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Loading animation step
  const [loadingStep, setLoadingStep] = useState(0);

  // Mobile touch drag-to-dismiss state
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const chatBottomRef = useRef(null);

  const postId = postData?.id || postData?._id;

  // Rotating loading step messages for realistic, engaging perception
  useEffect(() => {
    if (!isOpen) return;
    const steps = [
      "Reading article & extracting structure...",
      "Analyzing technical concepts...",
      "Synthesizing community sentiment...",
      "Finalizing executive brief...",
    ];
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isOpen]);

  // TanStack Query for AI Post Analysis
  const {
    data: intelligenceData,
    isLoading: isAnalyzing,
    isError: isAnalysisError,
    error: analysisErrorObj,
    refetch: refetchAnalysis,
  } = useQuery({
    queryKey: ["aiAnalysis", postId, postData?.updatedAt],
    queryFn: async ({ signal }) => {
      setStreamRawText("");
      setIsCached(false);
      let resultData = null;

      await fetchAIAnalysisStream({
        post: postData,
        onCached: (data) => {
          setIsCached(true);
          resultData = data;
        },
        onChunk: (text) => {
          setStreamRawText((prev) => prev + text);
        },
        onDone: (data) => {
          resultData = data;
        },
        onError: (errMsg) => {
          throw new Error(errMsg || "Streaming error occurred");
        },
        signal,
      });

      if (!resultData) {
        if (streamRawText) {
          resultData = {
            summary: streamRawText,
            promptChips: [],
            keyTakeaways: [],
            sentiment: null,
          };
        } else {
          throw new Error("No analysis result received.");
        }
      }

      return resultData;
    },
    enabled: isOpen && !!postData && !!postId,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const error = analysisErrorObj ? analysisErrorObj.message : null;

  // TanStack Mutation for AI Chat
  const chatMutation = useMutation({
    mutationFn: async ({ text, messageIndex }) => {
      await fetchAIChatStream({
        post: postData,
        message: text,
        chatHistory: chatMessages,
        onChunk: (chunkText) => {
          setChatMessages((prev) => {
            const updated = [...prev];
            if (updated[messageIndex]) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                text: updated[messageIndex].text + chunkText,
              };
            }
            return updated;
          });
        },
      });
    },
    onError: (err, { messageIndex }) => {
      setChatMessages((prev) => {
        const updated = [...prev];
        if (updated[messageIndex]) {
          updated[messageIndex] = {
            sender: "assistant",
            text: `⚠️ ${err.message || "Chat request failed."}`,
          };
        }
        return updated;
      });
    },
  });

  const isChatStreaming = chatMutation.isPending;

  // Active dynamic prompt chips from AI generation, fallback to default
  const activePromptChips =
    intelligenceData?.promptChips?.length > 0
      ? intelligenceData.promptChips
      : DEFAULT_PROMPT_CHIPS;

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 80) {
      onClose();
    }
    setDragY(0);
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  // Handle continuous chat submission using TanStack Mutation
  const handleSendMessage = (messageToSend) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || isChatStreaming) return;

    setActiveTab("chat");

    const newHistory = [...chatMessages, { sender: "user", text }];
    const assistantMsgIndex = newHistory.length;

    setChatMessages([...newHistory, { sender: "assistant", text: "" }]);
    if (!messageToSend) setInputMessage("");

    chatMutation.mutate({ text, messageIndex: assistantMsgIndex });
  };

  const copyToClipboard = () => {
    if (!intelligenceData) return;
    const textToCopy = `Spread AI Brief: ${intelligenceData.summary}\n\nKey Takeaways:\n${intelligenceData.keyTakeaways
      ?.map((t) => `- ${t.phrase}: ${t.detail}`)
      .join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const loadingStepLabels = [
    "Reading post & understanding context...",
    "Extracting key architectural concepts...",
    "Synthesizing reader sentiment...",
    "Compiling executive brief...",
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-center sm:justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-200 cursor-pointer animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragY === 0 ? "transform 0.25s ease-out" : "none",
        }}
        className="w-full max-w-lg h-[90vh] sm:h-full bg-white dark:bg-[#0c0c0e] text-stone-900 dark:text-stone-100 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 shadow-2xl rounded-t-2xl sm:rounded-none flex flex-col justify-between animate-in slide-in-from-bottom-full sm:slide-in-from-right-full duration-250 ease-out cursor-default overflow-hidden font-sans"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden w-full flex justify-center py-2 bg-transparent cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
        </div>

        {/* Minimalist Professional Header (X/Grok style) */}
        <header className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Elegant AI glyph */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 text-stone-100 dark:text-stone-900 flex items-center justify-center text-sm shadow-xs shrink-0">
              {icons.appreciate}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm tracking-tight text-stone-900 dark:text-stone-100">
                  Spread Intelligence
                </h2>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
                  Gemini 2.5
                </span>
                {isCached && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-0.5">
                    <span className="text-xs">{icons.bolt}</span>
                    Cached
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[210px] sm:max-w-xs">
                {postData?.title || "Post Analysis"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={refetchAnalysis}
              disabled={isAnalyzing}
              title="Refresh Analysis"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors disabled:opacity-40 cursor-pointer text-base"
            >
              <span className={`inline-block ${isAnalyzing ? "animate-spin text-amber-500" : ""}`}>
                {icons.refresh}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close Panel"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors cursor-pointer text-lg"
            >
              {icons.close}
            </button>
          </div>
        </header>

        {/* Sleek Underline Tab Switcher (Industry Standard) */}
        <div className="px-5 border-b border-stone-100 dark:border-stone-800/80 flex items-center gap-6 text-xs shrink-0 bg-white dark:bg-[#0c0c0e]">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={`py-2.5 font-medium transition-colors relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === "summary"
                ? "text-stone-900 dark:text-stone-100 font-semibold"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
            }`}
          >
            <span>Overview</span>
            {activeTab === "summary" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-stone-100 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`py-2.5 font-medium transition-colors relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === "chat"
                ? "text-stone-900 dark:text-stone-100 font-semibold"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
            }`}
          >
            <span>Discussion</span>
            {chatMessages.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
                {chatMessages.length}
              </span>
            )}
            {activeTab === "chat" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-stone-100 rounded-full" />
            )}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-stone-800 dark:text-stone-200">
          {error ? (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-xs space-y-2">
              <p className="font-semibold text-red-700 dark:text-red-400">Analysis Unavailable</p>
              <p className="text-red-600/90 dark:text-red-300/90 leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={refetchAnalysis}
                className="mt-1 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-semibold hover:opacity-90 transition-opacity text-xs cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : activeTab === "summary" ? (
            /* Executive Brief View */
            <div className="space-y-5">
              {/* High-End Loading State */}
              {isAnalyzing && !intelligenceData && !streamRawText ? (
                <div className="space-y-5 py-3">
                  {/* Dynamic Status Pill */}
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>{loadingStepLabels[loadingStep]}</span>
                  </div>

                  {/* Prose Skeleton Loader */}
                  <div className="space-y-2.5">
                    <div className="h-3.5 bg-stone-200/70 dark:bg-stone-800/70 rounded-md w-full animate-pulse" />
                    <div className="h-3.5 bg-stone-200/70 dark:bg-stone-800/70 rounded-md w-[92%] animate-pulse" />
                    <div className="h-3.5 bg-stone-200/70 dark:bg-stone-800/70 rounded-md w-[85%] animate-pulse" />
                    <div className="h-3.5 bg-stone-200/70 dark:bg-stone-800/70 rounded-md w-[60%] animate-pulse" />
                  </div>

                  {/* Cards Skeleton */}
                  <div className="pt-2 space-y-3">
                    <div className="h-16 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200/50 dark:border-stone-800/60 animate-pulse" />
                    <div className="h-16 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200/50 dark:border-stone-800/60 animate-pulse" />
                  </div>
                </div>
              ) : intelligenceData ? (
                <>
                  {/* Executive Brief Card */}
                  <section className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                        Executive Summary
                      </span>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
                      >
                        <span className="text-xs">{copied ? icons.check : icons.copy}</span>
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-50/80 dark:bg-[#111114] border border-stone-200/60 dark:border-stone-800/80 text-[13px] leading-relaxed text-stone-800 dark:text-stone-200 font-normal">
                      {intelligenceData.summary}
                    </div>
                  </section>

                  {/* Suggested Prompts (Grok/Claude pill strip) */}
                  <section className="space-y-2">
                    <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                      Follow-up Exploration
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePromptChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(chip.prompt)}
                          disabled={isChatStreaming}
                          className="text-xs px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/50 hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800/70 text-stone-700 dark:text-stone-300 font-medium transition-all cursor-pointer shadow-2xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Key Takeaways & Architectural Concepts */}
                  {intelligenceData.keyTakeaways?.length > 0 && (
                    <section className="space-y-2.5">
                      <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                        Key Architectural Insights
                      </span>
                      <div className="space-y-2">
                        {intelligenceData.keyTakeaways.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-stone-50/50 dark:bg-[#111114]/60 border border-stone-200/50 dark:border-stone-800/60 space-y-1 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-xs sm:text-[13px] text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                <span className="text-amber-500 text-xs font-mono">0{idx + 1}</span>
                                {item.phrase || `Concept #${idx + 1}`}
                              </span>
                              {item.confidenceScore && (
                                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                                  {item.confidenceScore}% match
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pl-5">
                              {item.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Community Sentiment Meter */}
                  {intelligenceData.sentiment && (
                    <section className="p-3.5 rounded-xl bg-stone-50/50 dark:bg-[#111114]/60 border border-stone-200/50 dark:border-stone-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                          <span className="text-emerald-500">{icons.grow}</span>
                          Community Reception
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {intelligenceData.sentiment.overall || "POSITIVE"} • {intelligenceData.sentiment.score || 88}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${intelligenceData.sentiment.score || 88}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                        {intelligenceData.sentiment.breakdown}
                      </p>
                    </section>
                  )}
                </>
              ) : (
                /* Streaming fallback */
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                  {streamRawText}
                  <span className="inline-block w-1.5 h-3.5 bg-stone-900 dark:bg-stone-100 animate-pulse ml-1 align-middle" />
                </div>
              )}
            </div>
          ) : (
            /* Discussion / Interactive Chat View */
            <div className="flex flex-col h-full justify-between space-y-4">
              {/* Quick Chip Shortcuts */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 shrink-0">
                {activePromptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.prompt)}
                    disabled={isChatStreaming}
                    className="text-xs px-3 py-1 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3 min-h-[240px] overflow-y-auto pr-0.5">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-stone-500 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400">
                      {icons.appreciate}
                    </div>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Ask anything about this article
                    </p>
                    <p className="text-[11px] max-w-xs text-stone-400">
                      Spread AI is equipped with full post context, code samples, and community comments.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-tr-xs font-medium shadow-xs"
                            : "bg-stone-100/90 dark:bg-[#141416] text-stone-800 dark:text-stone-200 rounded-tl-xs border border-stone-200/60 dark:border-stone-800/60"
                        }`}
                      >
                        {msg.text || (
                          <span className="flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>
            </div>
          )}
        </div>

        {/* Minimalist Integrated Input Bar */}
        <footer className="p-3.5 border-t border-stone-100 dark:border-stone-800/80 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md shrink-0 space-y-1.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-[#151518] border border-stone-200/80 dark:border-stone-800/80 focus-within:border-stone-400 dark:focus-within:border-stone-600 transition-colors"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask follow-up questions or request details..."
              className="flex-1 text-xs bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isChatStreaming}
              className="p-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 hover:opacity-90 transition-opacity disabled:opacity-30 flex items-center justify-center shrink-0 cursor-pointer text-xs"
            >
              {icons.sendFi}
            </button>
          </form>
          <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
            Gemini 2.5 Flash • Spread AI may produce inaccurate insights.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default memo(AIDrawer);

