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
          limit: 30,
          conversationId,
          lastTimestamp: pageParam,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const sendMessage = async ({
    id,
    conversationId,
    content,
    replyedTo,
  }) => {
    try {
      const result = await axiosInstance.post(`/messaging/c/send/message`, {
        id,
        conversationId,
        content,
        replyedTo,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const publishEncryptionIdentity = async (publicKey) => {
    const result = await axiosInstance.put(`/messaging/keys/identity`, { publicKey });
    return result.data;
  };

  const getConversationEncryptionKeys = async (conversationId) => {
    const result = await axiosInstance.get(`/messaging/c/encryption-keys`, {
      params: { conversationId },
    });
    return result.data.keys;
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
    sendMessage,
    publishEncryptionIdentity,
    getConversationEncryptionKeys,
  };
}

export default ChatApi;
