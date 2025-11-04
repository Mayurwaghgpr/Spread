import axiosInstance from "./axios";

function ChatApi() {
  const startPrivateChat = async (chatUserId) => {
    try {
      const result = await axiosInstance.post(`/messaging/p/create`, {
        chatUserId,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  //Create Group
  const createGroup = async ({ groupName, membersArr }) => {
    try {
      const result = await axiosInstance.post(`/messaging/g/create`, {
        groupName,
        membersArr,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getMessage = async ({ pageParam, conversationId }) => {
    try {
      const result = await axiosInstance.get(`/messaging/c/messages`, {
        withCredentials: true,
        params: {
          conversationId,
          lastTimestamp: pageParam,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getConversations = async ({ pageParam }) => {
    try {
      const result = await axiosInstance.get(`/messaging/c/all`, {
        params: {
          lastTimestamp: pageParam,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const setMessageToMute = async ({ isMuteMessage, conversationId }) => {
    try {
      const result = await axiosInstance.put(`/messaging/c/message/mute`, {
        isMuteMessage,
        conversationId,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    getMessage,
    getConversations,
    startPrivateChat,
    createGroup,
    setMessageToMute,
  };
}

export default ChatApi;
