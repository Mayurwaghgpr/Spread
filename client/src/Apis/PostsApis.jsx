import axios from "axios";
import axiosInstance from "./axios";

function PostsApis() {
  // Fetch all posts with pagination and filtering by topic
  const fetchDataAll = async ({ pageParam, topic }) => {
    try {
      const response = await axiosInstance.get(`/posts/all`, {
        params: {
          limit: 3,
          lastTimestamp: pageParam,
          type: topic,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const AddNewPost = async (newPost, signal) => {
    try {
      const result = await axiosInstance.post(`/posts/add`, newPost, {
        withCredentials: true,
        signal: signal,
      });
      return result.data; // Return the actual data
    } catch (error) {
      throw error.response || error;
    }
  };
  const Comments = async (comment) => {
    try {
      const result = await axiosInstance.post(`/comment/new`, comment, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getComments = async ({ postId, pageParam }) => {
    // console.log("fetch", postId);
    try {
      const result = await axiosInstance.get(`/comment/top/all`, {
        params: {
          postId,
          limit: 5,
          page: pageParam,
        },
        withCredentials: true,
      });
      return result.data; // Return the actual data
    } catch (error) {
      throw error.response || error;
    }
  };
  const hitLike = async (comtId) => {
    try {
      const result = await axiosInstance.get(`/comment/like/${comtId}`, {
        withCredentials: true,
      });
      return result.data; // Return the actual data
    } catch (error) {
      throw error.response || error;
    }
  };
  const getReplies = async ({ topCommentId, postId, pageParam }) => {
    try {
      const result = await axiosInstance.get(`/comment/replys/all`, {
        withCredentials: true,
        params: {
          topCommentId,
          postId,
          page: pageParam,
          limit: 3,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const pinComment = async (data) => {
    try {
      const result = await axiosInstance.put(`/comment/pin`, data);
      return result.data.result;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getAiGenAnalysis = async (data) => {
    try {
      const result = await axiosInstance.post(`/ai/analysis`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const getAiGenTags = async (data) => {
    try {
      const result = await axiosInstance.post(`/ai/tags`, data);

      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const deleteComtApi = async (commentId) => {
    try {
      const result = await axiosInstance.delete(
        `/comment/delete/${commentId}`,
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const DeletePostApi = async (id) => {
    try {
      const response = await axiosInstance.delete(`/posts/delete/${id.trim()}`);

      // console.log("DeletePostApi response:", response);
      return response.data; // Return the actual data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        localStorage.removeItem("AccessToken");
      }
      throw error.response || error;
    }
  };

  return {
    DeletePostApi,
    AddNewPost,
    fetchDataAll,
    getComments,
    Comments,
    hitLike,
    getReplies,
    pinComment,
    deleteComtApi,
    getAiGenTags,
    getAiGenAnalysis,
  };
}

export default PostsApis;
