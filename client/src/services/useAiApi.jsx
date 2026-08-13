import axiosInstance from "./axios";

function useAiApi() {
  /**
   * Stream AI Post Analysis using Server-Sent Events (SSE)
   */
  const fetchAIAnalysisStream = async ({
    post,
    onChunk,
    onCached,
    onDone,
    onError,
    signal,
  }) => {
    try {
      const token = localStorage.getItem("AccessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${axiosInstance.defaults.baseURL}/ai/analysis`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ post }),
          signal,
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("AccessToken");
        throw new Error("Please log in to access AI analysis.");
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "AI Analysis request failed.");
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
                  onCached?.(event.data);
                } else if (event.type === "chunk") {
                  onChunk?.(event.text);
                } else if (event.type === "done") {
                  onDone?.(event.data);
                } else if (event.type === "error") {
                  onError?.(event.message || "Streaming error occurred");
                }
              } catch (e) {
                // Ignore parse errors for partial lines
              }
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        throw err;
      }
    }
  };

  /**
   * Stream AI Q&A Chat using Server-Sent Events (SSE)
   */
  const fetchAIChatStream = async ({
    post,
    message,
    chatHistory,
    onChunk,
    onError,
    signal,
  }) => {
    try {
      const token = localStorage.getItem("AccessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${axiosInstance.defaults.baseURL}/ai/chat`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            post,
            message,
            chatHistory,
          }),
          signal,
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("AccessToken");
        throw new Error("Please log in to chat with AI.");
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "AI Chat request failed.");
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
                  onChunk?.(event.text);
                } else if (event.type === "error") {
                  onError?.(event.message || "Chat error occurred");
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        throw err;
      }
    }
  };

  /**
   * Generate tags for posts
   */
  const fetchAITags = async (post) => {
    try {
      const response = await axiosInstance.post("/ai/tags", { post });
      return response.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    fetchAIAnalysisStream,
    fetchAIChatStream,
    fetchAITags,
  };
}

export default useAiApi;
