import { useState, useEffect, useRef, memo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useIcons from "../../hooks/useIcons";
import useAiApi from "../../services/useAiApi";

const DEFAULT_PROMPT_CHIPS = [
  { label: "💡 Explain simply", prompt: "Explain this post in simple terms for a beginner." },
  { label: "🔍 Fact check claims", prompt: "Extract and fact-check the major claims made in this post." },
  { label: "⚡ Key takeaways", prompt: "What are the practical takeaways and action items from this post?" },
  { label: "💬 Reader sentiment", prompt: "Summarize the community sentiment based on comments and post tone." },
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

  // Mobile touch drag-to-dismiss state
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const chatBottomRef = useRef(null);

  const postId = postData?.id || postData?._id;

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
    const textToCopy = `Spread AI Summary: ${intelligenceData.summary}\n\nKey Takeaways:\n${intelligenceData.keyTakeaways
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-center sm:justify-end bg-black/60 backdrop-blur-md transition-all duration-300 cursor-pointer animate-in fade-in"
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
        className="w-full max-w-lg h-[86vh] sm:h-full spread-card bg-[#fff9f3] dark:bg-[#121212] text-stone-900 dark:text-stone-100 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 shadow-2xl rounded-t-3xl sm:rounded-none flex flex-col justify-between animate-in slide-in-from-bottom-full sm:slide-in-from-right-full duration-300 ease-out cursor-default overflow-hidden backdrop-blur-2xl"
      >
        {/* Mobile Drag Handle Bar */}
        <div className="sm:hidden w-full flex justify-center py-2.5 bg-stone-200/50 dark:bg-stone-800/40 border-b border-stone-200/40 dark:border-stone-800/40 cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-stone-400/60 dark:bg-stone-600/60" />
        </div>

        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/60 dark:bg-stone-900/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-md shrink-0 flex items-center justify-center text-lg">
              {icons.appreciate}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  Spread AI Insights
                  {isCached && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-200/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 font-bold flex items-center gap-1 shrink-0">
                      <span className="text-amber-500 text-xs">{icons.bolt}</span>
                      Fast
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[170px] sm:max-w-xs font-medium">
                {postData?.title || "Post Analysis"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={refetchAnalysis}
              disabled={isAnalyzing}
              title="Refresh AI Analysis"
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors disabled:opacity-40 cursor-pointer text-lg"
            >
              <span className={`inline-block ${isAnalyzing ? "animate-spin text-amber-500" : ""}`}>
                {icons.refresh}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-xl"
            >
              {icons.close}
            </button>
          </div>
        </div>

        {/* Minimalist Tab Switcher */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-200/60 dark:bg-stone-800/60 border border-stone-300/40 dark:border-stone-700/40">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "summary"
                  ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <span className="text-sm">{icons.docTab}</span>
              <span>AI Summary</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "chat"
                  ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <span className="text-sm">{icons.chatTab}</span>
              <span>Ask AI {chatMessages.length > 0 && `(${chatMessages.length})`}</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-stone-800 dark:text-stone-200">
          {error ? (
            <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs space-y-2">
              <p className="font-black text-sm">AI Analysis Error</p>
              <p className="leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={refetchAnalysis}
                className="mt-2 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-bold hover:opacity-90 transition-all text-xs cursor-pointer"
              >
                Retry Analysis
              </button>
            </div>
          ) : activeTab === "summary" ? (
            /* AI Summary View */
            <div className="space-y-4">
              {isAnalyzing && !intelligenceData && !streamRawText ? (
                <div className="space-y-4 py-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400 animate-pulse">
                    <span className="animate-spin text-amber-500 text-sm">{icons.appreciate}</span>
                    <span>Spread AI is analyzing post & community context...</span>
                  </div>
                  <div className="h-28 bg-stone-200/50 dark:bg-stone-800/40 rounded-2xl border border-stone-300/40 dark:border-stone-800 animate-pulse"></div>
                  <div className="h-40 bg-stone-200/50 dark:bg-stone-800/40 rounded-2xl border border-stone-300/40 dark:border-stone-800 animate-pulse"></div>
                </div>
              ) : intelligenceData ? (
                <>
                  {/* Executive Summary Block */}
                  <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-amber-500 text-sm">{icons.appreciate}</span>
                        What You Need To Know
                      </h3>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <span className="text-emerald-500 text-sm">{icons.check}</span>
                            <span className="text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm">{icons.copy}</span>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-medium">
                      {intelligenceData.summary}
                    </p>
                  </div>

                  {/* AI Quick Action Prompts Bar */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Ask AI Follow-ups
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {activePromptChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(chip.prompt)}
                          disabled={isChatStreaming}
                          className="text-xs px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-200/50 dark:bg-stone-800/60 hover:bg-stone-300/70 dark:hover:bg-stone-700/80 text-stone-800 dark:text-stone-200 transition-all font-bold whitespace-nowrap shrink-0 cursor-pointer shadow-xs active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Key Concepts & Insights */}
                  {intelligenceData.keyTakeaways?.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Key Insights & Context
                      </h3>
                      <div className="space-y-2.5">
                        {intelligenceData.keyTakeaways.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/60 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                {item.phrase || `Insight #${idx + 1}`}
                              </span>
                              {item.confidenceScore && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold shrink-0">
                                  {item.confidenceScore}% confidence
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-3.5">
                              {item.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community & Reader Sentiment */}
                  {intelligenceData.sentiment && (
                    <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/60 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="text-emerald-500 text-sm">{icons.grow}</span>
                          Community Sentiment
                        </h3>
                        <span className="text-xs font-black tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          {intelligenceData.sentiment.overall || "POSITIVE"}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${intelligenceData.sentiment.score || 85}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                        {intelligenceData.sentiment.breakdown}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Streaming fallback preview */
                <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 text-xs text-stone-800 dark:text-stone-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {streamRawText}
                  <span className="inline-block w-2 h-4 bg-stone-900 dark:bg-stone-100 animate-pulse ml-1 align-middle"></span>
                </div>
              )}
            </div>
          ) : (
            /* Interactive AI Q&A Chat View */
            <div className="flex flex-col h-full justify-between space-y-3">
              {/* Quick Action Prompt Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 shrink-0">
                {activePromptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.prompt)}
                    disabled={isChatStreaming}
                    className="text-xs px-3 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-200/50 dark:bg-stone-800/80 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-all font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 space-y-3 min-h-[220px] overflow-y-auto pr-1">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-stone-500 space-y-2">
                    <div className="p-3.5 rounded-2xl bg-stone-200/50 dark:bg-stone-800/50 border border-stone-300 dark:border-stone-700 text-xl">
                      {icons.person}
                    </div>
                    <p className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                      Ask Spread AI follow-up questions
                    </p>
                    <p className="text-[11px] max-w-xs text-stone-400 font-medium">
                      Spread AI has complete context on this post and reader discussions.
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
                        className={`max-w-[88%] sm:max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold rounded-tr-xs shadow-md"
                            : "bg-stone-200/70 dark:bg-stone-800/70 text-stone-800 dark:text-stone-200 rounded-tl-xs border border-stone-300/50 dark:border-stone-700/50 font-medium"
                        }`}
                      >
                        {msg.text || (
                          <span className="flex items-center gap-1 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
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

        {/* Floating Input Capsule Bar */}
        <div className="p-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur-md shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Spread AI about this post..."
              className="flex-1 px-4 py-2.5 text-[16px] sm:text-xs rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isChatStreaming}
              className="p-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center shrink-0 cursor-pointer shadow-md text-sm"
            >
              {icons.sendFi}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(AIDrawer);
