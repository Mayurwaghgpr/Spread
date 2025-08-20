import { useDispatch } from "react-redux";
import axiosInstance from "./axios";
import { setLoadingHome } from "../store/slices/commonSlice";
function usePublicApis() {
  const dispatch = useDispatch();
  const fetchPeopels = async ({ pageParam, username }) => {
    try {
      const result = await axiosInstance.get(`/public/h/peoples`, {
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
  const fetchHomeContent = async () => {
    dispatch(setLoadingHome(true));
    try {
      const result = await axiosInstance.get(`/public/h/content`, {});
      return result.data;
    } catch (error) {
      console.error("Error fetching user preferences data:", error);
      throw error.response || error;
    }
  };

  // Fetch data by post ID
  const fetchDataById = async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`, {});
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
    console.log(postId, liketype);
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

  const ArchivePost = async (postId) => {
    try {
      const result = await axiosInstance.put(`/public/archive`, { postId });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const removePostFromArchive = async (id) => {
    try {
      const result = await axiosInstance.delete(`/public/archive?id=${id}`);
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
    fetchAllUsers,
    fetchPeopels,
  };
}

export default usePublicApis;
