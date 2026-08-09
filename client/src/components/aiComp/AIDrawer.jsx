import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../buttons/Ibutton";
import FedInBtn from "../buttons/FedInBtn";

const QUICK_CHIPS = [
  { label: "💡 Simplify for Beginners", prompt: "Explain this post in simple terms for a beginner." },
  { label: "🔍 Fact Check Claims", prompt: "Extract and fact-check the major claims made in this post." },
  { label: "📝 Action Items", prompt: "What are the practical, key takeaways and action items from this post?" },
  { label: "💬 Reader Sentiment", prompt: "Summarize the community sentiment based on comments and post tone." },
];

const AIDrawer = ({ isOpen, onClose, postData }) => {
  const icons = useIcons();
  const [activeTab, setActiveTab] = useState("intelligence"); // 'intelligence' | 'chat'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [streamRawText, setStreamRawText] = useState("");
  const [error, setError] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [copied, setCopied] = useState(false);

  const abortControllerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  // Fetch structured analysis
  const fetchAnalysis = useCallback(async () => {
    if (!postData) return;
    setIsAnalyzing(true);
    setError(null);
    setIntelligenceData(null);
    setStreamRawText("");
    setIsCached(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/ai/analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ post: postData }),
          signal: controller.signal,
        }
      );

      if (response.status === 401) {
        throw new Error("Please log in to access AI analysis.");
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "AI Analysis failed to load.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              try {
                const event = JSON.parse(trimmed.replace(/^data:\s*/, ""));
                if (event.type === "cached") {
                  setIsCached(true);
                  setIntelligenceData(event.data);
                  setIsAnalyzing(false);
                } else if (event.type === "chunk") {
                  setStreamRawText((prev) => prev + event.text);
                } else if (event.type === "done") {
                  setIntelligenceData(event.data);
                  setIsAnalyzing(false);
                } else if (event.type === "error") {
                  setError(event.message || "Streaming error occurred");
                  setIsAnalyzing(false);
                }
              } catch (e) {
                // fallback
              }
            }
          }
        }
      }
      setIsAnalyzing(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to reach AI service.");
        setIsAnalyzing(false);
      }
    }
  }, [postData]);

  useEffect(() => {
    if (isOpen && postData && !intelligenceData && !isAnalyzing) {
      fetchAnalysis();
    }
  }, [isOpen, postData, intelligenceData, isAnalyzing, fetchAnalysis]);

  // Handle continuous chat submission
  const handleSendMessage = async (messageToSend) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || isChatStreaming) return;

    const newHistory = [...chatMessages, { sender: "user", text }];
    setChatMessages(newHistory);
    if (!messageToSend) setInputMessage("");
    setIsChatStreaming(true);

    const assistantMsgIndex = newHistory.length;
    setChatMessages((prev) => [...prev, { sender: "assistant", text: "" }]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            post: postData,
            message: text,
            chatHistory: chatMessages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              try {
                const event = JSON.parse(trimmed.replace(/^data:\s*/, ""));
                if (event.type === "chat_chunk") {
                  setChatMessages((prev) => {
                    const updated = [...prev];
                    if (updated[assistantMsgIndex]) {
                      updated[assistantMsgIndex] = {
                        ...updated[assistantMsgIndex],
                        text: updated[assistantMsgIndex].text + event.text,
                      };
                    }
                    return updated;
                  });
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      setChatMessages((prev) => {
        const updated = [...prev];
        if (updated[assistantMsgIndex]) {
          updated[assistantMsgIndex] = {
            sender: "assistant",
            text: "⚠️ Sorry, I encountered an error answering your message.",
          };
        }
        return updated;
      });
    } finally {
      setIsChatStreaming(false);
    }
  };

  const copyToClipboard = () => {
    if (!intelligenceData) return;
    const textToCopy = `AI Summary: ${intelligenceData.summary}\n\nKey Takeaways:\n${intelligenceData.keyTakeaways
      ?.map((t) => `- ${t.phrase}: ${t.detail}`)
      .join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard navigation (Escape to close)
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
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
    >
      <div
        className="w-full max-w-lg h-full bg-light dark:bg-dark border-l border-inherit shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out font-sans cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between bg-[#f5f1ec]/50 dark:bg-[#121212]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg border border-inherit bg-light dark:bg-dark text-stone-800 dark:text-stone-200">
              {icons["glitter"]}
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Spread AI Assistant
                {isCached && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-inherit bg-[#f5f1ec] dark:bg-[#121212] text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1">
                    <span className="w-3 h-3 text-amber-500">{icons["bolt"]}</span> Cached
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-xs">
                {postData?.title || "Post Analysis"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Ibutton
              action={fetchAnalysis}
              disabled={isAnalyzing}
              title="Refresh"
              className="p-2 rounded-lg border border-inherit hover:bg-[#f5f1ec] dark:hover:bg-[#121212] text-stone-600 dark:text-stone-400 transition-colors disabled:opacity-40"
            >
              <span className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`}>
                {icons["refresh"]}
              </span>
            </Ibutton>
            <Ibutton
              action={onClose}
              className="p-2 rounded-lg border border-inherit hover:bg-[#f5f1ec] dark:hover:bg-[#121212] text-stone-600 dark:text-stone-400 transition-colors"
            >
              <span className="w-5 h-5">{icons["close"]}</span>
            </Ibutton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-inherit px-4 pt-2 gap-4">
          <Ibutton
            action={() => setActiveTab("intelligence")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "intelligence"
                ? "border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100"
                : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <span className="w-4 h-4">{icons["docTab"]}</span>
            Structured Insights
          </Ibutton>
          <Ibutton
            action={() => setActiveTab("chat")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "chat"
                ? "border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100"
                : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <span className="w-4 h-4">{icons["chatTab"]}</span>
            Interactive Q&A
          </Ibutton>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 border-inherit">
          {error ? (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400 text-xs">
              <p className="font-semibold">Analysis Error</p>
              <p className="mt-1">{error}</p>
              <Ibutton
                action={fetchAnalysis}
                className="mt-3 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium hover:opacity-90 transition-all text-xs"
              >
                Try Again
              </Ibutton>
            </div>
          ) : activeTab === "intelligence" ? (
            /* Structured Intelligence View */
            <div className="space-y-4">
              {isAnalyzing && !intelligenceData && !streamRawText ? (
                <div className="space-y-3">
                  <h1 className="text-sm font-bold shimmer-effect dark:shimmer-effect-dark">
                    Analyzing post content...
                  </h1>
                  <div className="h-20 bg-[#f5f1ec] dark:bg-[#121212] rounded-xl border border-inherit animate-pulse"></div>
                  <div className="h-32 bg-[#f5f1ec] dark:bg-[#121212] rounded-xl border border-inherit animate-pulse"></div>
                </div>
              ) : intelligenceData ? (
                <>
                  {/* Action Toolbar */}
                  <div className="flex justify-end">
                    <Ibutton
                      action={copyToClipboard}
                      className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    >
                      {copied ? (
                        <span className="w-4 h-4 text-emerald-500">{icons["check"]}</span>
                      ) : (
                        <span className="w-4 h-4">{icons["copy"]}</span>
                      )}
                      <span>{copied ? "Copied!" : "Copy Insights"}</span>
                    </Ibutton>
                  </div>

                  {/* Executive Summary */}
                  {intelligenceData.summary && (
                    <div className="p-4 rounded-xl border border-inherit bg-[#f5f1ec] dark:bg-[#121212]">
                      <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        {icons["glitter"]} Executive Summary
                      </h3>
                      <p className="text-xs leading-relaxed text-stone-800 dark:text-stone-200">
                        {intelligenceData.summary}
                      </p>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {intelligenceData.keyTakeaways?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Key Concepts & Insights
                      </h3>
                      <div className="space-y-2">
                        {intelligenceData.keyTakeaways.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-inherit bg-[#f5f1ec] dark:bg-[#121212]"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                {item.phrase || `Insight #${idx + 1}`}
                              </span>
                              {item.confidenceScore && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-inherit bg-light dark:bg-dark text-stone-700 dark:text-stone-300 font-semibold">
                                  {item.confidenceScore}% confidence
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community & Post Sentiment */}
                  {intelligenceData.sentiment && (
                    <div className="p-3.5 rounded-xl border border-inherit bg-[#f5f1ec] dark:bg-[#121212]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-4 h-4 text-stone-700 dark:text-stone-300">{icons["grow"]}</span> Reader Sentiment
                        </h3>
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {intelligenceData.sentiment.overall || "POSITIVE"}
                        </span>
                      </div>
                      {/* Sentiment Bar */}
                      <div className="w-full bg-stone-300 dark:bg-stone-700 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-stone-900 dark:bg-stone-100 h-full rounded-full transition-all duration-500"
                          style={{ width: `${intelligenceData.sentiment.score || 85}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300">
                        {intelligenceData.sentiment.breakdown}
                      </p>
                    </div>
                  )}

                  {/* Actionable Takeaways */}
                  {intelligenceData.actionableItems?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Actionable Takeaways
                      </h3>
                      <ul className="space-y-1.5">
                        {intelligenceData.actionableItems.map((action, i) => (
                          <li
                            key={i}
                            className="text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2"
                          >
                            <span className="w-4 h-4 text-stone-900 dark:text-stone-100 shrink-0 mt-0.5">{icons["check"]}</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                /* Streaming fallback preview */
                <div className="p-4 rounded-xl border border-inherit bg-[#f5f1ec] dark:bg-[#121212] text-xs text-stone-800 dark:text-stone-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {streamRawText}
                  <span className="inline-block w-2 h-4 bg-stone-900 dark:bg-stone-100 animate-pulse ml-1 align-middle"></span>
                </div>
              )}
            </div>
          ) : (
            /* Interactive Q&A Chat View */
            <div className="flex flex-col h-full justify-between space-y-4">
              {/* Quick Action Prompt Chips */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHIPS.map((chip, idx) => (
                  <FedInBtn
                    key={idx}
                    action={() => handleSendMessage(chip.prompt)}
                    disabled={isChatStreaming}
                    className="text-[11px] px-3 py-1 rounded-full border border-inherit bg-[#f5f1ec] dark:bg-[#121212] hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors font-medium"
                  >
                    {chip.label}
                  </FedInBtn>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3 min-h-[250px] overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 dark:text-stone-500 text-xs">
                    <div className="w-8 h-8 mx-auto mb-2 opacity-50 flex items-center justify-center">
                      {icons["glitter"]}
                    </div>
                    Ask any follow-up question or pick a prompt chip above to get deeper insights.
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
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed border border-inherit ${
                          msg.sender === "user"
                            ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-br-none"
                            : "bg-[#f5f1ec] dark:bg-[#121212] text-stone-800 dark:text-stone-200 rounded-bl-none"
                        }`}
                      >
                        {msg.text || (
                          <span className="flex items-center gap-1">
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

        {/* Input Bar (Chat mode) */}
        {activeTab === "chat" && (
          <div className="p-3 border-t border-inherit bg-light dark:bg-dark">
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
                placeholder="Ask follow-up about this post..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-inherit bg-[#f5f1ec] dark:bg-[#121212] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
              <Ibutton
                type="submit"
                disabled={!inputMessage.trim() || isChatStreaming}
                className="p-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center"
              >
                <span className="w-4 h-4">{icons["sendO"]}</span>
              </Ibutton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AIDrawer);
