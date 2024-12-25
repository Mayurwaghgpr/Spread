import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function PostsApis() {
  // Fetch all posts with pagination and filtering by topic
  const fetchDataAll = async ({ pageParam, topic }) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/all`, {
        params: {
          limit: 3,
          page: pageParam,
          type: topic,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        // dispatch(setToast({ message: error.response.data, type: "error" }));
        localStorage.removeItem("AccessToken");
      } else {
        throw error.response;
      }
    }
  };
  const AddNewPost = async (newPost, signal) => {
    try {
      const result = await axios.post(`${BASE_URL}/posts/add`, newPost, {
        withCredentials: true,
        signal: signal,
      });
      return result.data; // Return the actual data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        localStorage.removeItem("AccessToken");
      }
      console.error("AddNewPost error:", error);
      throw error;
    }
  };
  const Comments = async (comment) => {
    try {
      const result = await axios.post(`${BASE_URL}/comment/new`, comment, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  };
  const getComments = async ({ postId, pageParam }) => {
    // console.log("fetch", postId);
    try {
      const result = await axios.get(`${BASE_URL}/comment/top`, {
        params: {
          postId,
          limit: 5,
          page: pageParam,
        },
        withCredentials: true,
      });
      return result.data; // Return the actual data
    } catch (error) {
      throw error;
    }
  };
  const hitLike = async (comtId) => {
    console.log(comtId);
    try {
      const result = await axios.get(`${BASE_URL}/comment/like/${comtId}`, {
        withCredentials: true,
      });
      console.log(result);
      return result.data; // Return the actual data
    } catch (error) {
      throw error;
    }
  };
  const getReplies = async ({ topCommentId, postId, pageParam }) => {
    try {
      const result = await axios.get(`${BASE_URL}/comment/replys`, {
        withCredentials: true,
        params: {
          topCommentId,
          postId,
          page: pageParam,
          limit: 1,
        },
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const result = await axios.delete(
        `${BASE_URL}/comment/delete/${commentId}`,
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  };
  const DeletePostApi = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/posts/delete/${id.trim()}`,
        {
          withCredentials: true,
        }
      );

      // console.log("DeletePostApi response:", response);
      return response.data; // Return the actual data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        localStorage.removeItem("AccessToken");
      }
      throw error;
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
    deleteComment,
  };
}

export default PostsApis;
