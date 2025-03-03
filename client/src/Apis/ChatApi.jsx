import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
function ChatApi() {
  const startPrivateChate = async (chatUserId) => {
    try {
      const result = await axios.post(
        `${BASE_URL}/messaging/p/create`,
        { chatUserId },
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getMessage = async (conversationId) => {
    try {
      const result = await axios.get(`${BASE_URL}/messaging/c/messages`, {
        withCredentials: true,
        params: {
          conversationId,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getConversations = async ({ pageParam }) => {
    try {
      const result = await axios.get(`${BASE_URL}/messaging/c/all`, {
        params: {
          lastTimestamp: pageParam,
        },
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  return { getMessage, getConversations, startPrivateChate };
}

export default ChatApi;
