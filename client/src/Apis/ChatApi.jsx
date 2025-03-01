import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
function ChatApi() {
  const sendMessage = async (message) => {
    try {
      const result = await axios.post(`${BASE_URL}/message`, message, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getConversations = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/messaging/c/all`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  return { sendMessage, getConversations };
}

export default ChatApi;
