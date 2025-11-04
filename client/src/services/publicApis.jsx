import { useDispatch } from "react-redux";
import axiosInstance from "./axios";

function usePublicApis() {
  const dispatch = useDispatch();
  const fetchPeopel = async ({ pageParam, username }) => {
    try {
      const result = await axiosInstance.get(`/public/h/all/users`, {
        params: {
          lastTimestamp: pageParam,
          q: username?.trim(),
        },
      });
      return result.data.peoples;
    } catch (error) {
      console.error("Error fetching user preferences data:", error);
      throw error.response || error;
    }
  };
  // Fetch user preferences data
  const fetchQuickUserSuggestion = async () => {
    try {
      const result = await axiosInstance.get(`/public/h/q/suggest/user`);
      return result.data;
    } catch (error) {
      console.error("Error fetching user preferences data:", error);
      throw error.response || error;
    }
  };
  // Fetch user preferences data
  const fetchQuickTags = async () => {
    try {
      const result = await axiosInstance.get(`/public/h/q/tags`);
      return result.data;
    } catch (error) {
      console.error("Error fetching user preferences data:", error);
      throw error.response || error;
    }
  };

  // Fetch data by post ID
  const fetchPostById = async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      throw error.response || error;
    }
  };

  // fetch data search by user

  const fetchSearchData = async (search) => {
    const searchResult = await axiosInstance.get(
      `/public/search?q=${search}`,
      {}
    );
    return searchResult.data;
  };
  const followUser = async ({ followerId, followedId }) => {
    try {
      const result = await axiosInstance.put(`/public/follow`, {
        followerId,
        followedId,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const fetchAllUsers = async (pageParam) => {
    try {
      const result = await axiosInstance.get(`/public/users/all`, {
        params: {
          limit: 5,
          lastTimestamp: pageParam,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const LikePost = async ({ postId, liketype }) => {
    try {
      const result = await axiosInstance.put(`/public/like`, {
        postId,
        liketype,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const unfollowUser = async ({ followerId, followedId }) => {
    try {
      const result = await axiosInstance.post(`/public/unfollow`, {
        followerId,
        followedId,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const savePost = async ({ postId, groupName }) => {
    try {
      const result = await axiosInstance.put(`/public/save`, {
        postId,
        groupName,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const removePostFromArchive = async (id) => {
    try {
      const result = await axiosInstance.delete(`/public/save?id=${id}`);
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    fetchQuickUserSuggestion,
    fetchQuickTags,
    fetchPostById,
    fetchSearchData,
    LikePost,
    removePostFromArchive,
    unfollowUser,
    savePost,
    followUser,
    fetchAllUsers,
    fetchPeopel,
  };
}

export default usePublicApis;
