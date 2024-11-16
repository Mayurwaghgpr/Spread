import axios from "axios";
import { useDispatch } from "react-redux";
import { setToast } from "../redux/slices/uiSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function usePublicApis() {
  const dispatch = useDispatch();
  // Fetch user preferences data
  const userPrepsData = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/public/prepsdata`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      console.error("Error fetching user preferences data:", error);
      throw error;
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

      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        localStorage.removeItem("AccessToken");
      }
      throw error;
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
      throw error.respons;
    }
  };

  const LikePost = async (likedPostId) => {
    try {
      const result = await axios.put(
        `${BASE_URL}/public/like`,
        { likedPostId },
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      throw error;
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
      console.log(error);
      throw error.respons;
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
      throw error;
    }
  };
  const removePostFromArchive = async (id) => {
    console.log(id);
    try {
      const result = await axios.delete(`${BASE_URL}/public/archive?id=${id}`, {
        withCredentials: true,
      });
      console.log({ result });
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    userPrepsData,
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
