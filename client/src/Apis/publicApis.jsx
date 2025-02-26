import axios from "axios";
import { useDispatch } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function usePublicApis() {
  const dispatch = useDispatch();
  // Fetch user preferences data
  const fetchHomeContent = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/public/h/content`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      console.error("Error fetching user preferences data:", error);
      throw error.response || error;
    }
  };

  // Fetch data by post ID
  const fetchDataById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      throw error.response || error;
    }
  };

  // fetch data search by user

  const fetchSearchData = async (search) => {
    const searchResult = await axios.get(
      `${BASE_URL}/public/search?q=${search}`,
      {
        withCredentials: true,
      }
    );
    return searchResult.data;
  };
  const followUser = async ({ followerId, followedId }) => {
    try {
      const result = await axios.put(
        `${BASE_URL}/public/follow/`,
        { followerId, followedId },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const LikePost = async ({ postId, liketype }) => {
    console.log(postId, liketype);
    try {
      const result = await axios.put(
        `${BASE_URL}/public/like`,
        { postId, liketype },
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const unfollowUser = async ({ followerId, followedId }) => {
    try {
      const result = await axios.post(
        `${BASE_URL}/public/unfollow`,
        { followerId, followedId },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const ArchivePost = async (postId) => {
    try {
      const result = await axios.put(
        `${BASE_URL}/public/archive`,
        { postId },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const removePostFromArchive = async (id) => {
    try {
      const result = await axios.delete(`${BASE_URL}/public/archive?id=${id}`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    fetchHomeContent,
    fetchDataById,
    fetchSearchData,
    LikePost,
    removePostFromArchive,
    unfollowUser,
    ArchivePost,
    followUser,
  };
}

export default usePublicApis;
