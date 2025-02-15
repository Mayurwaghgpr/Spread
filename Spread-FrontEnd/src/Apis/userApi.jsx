import axios from "axios";
import React from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
function userApi() {
  const getLogInUserData = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/user/details`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const getArchivedPosts = async ({ pageParam }) => {
    try {
      const result = await axios.get(`${BASE_URL}/posts/archived`, {
        withCredentials: true,
        params: {
          page: pageParam,
          limit: 3,
        },
      });
      return result.data;
    } catch (error) {}
  };

  const fetchFollowInfo = async ({ FollowInfo, profileId }) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/user/${FollowInfo}/${profileId}`,
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {}
  };

  return {
    getArchivedPosts,
    getLogInUserData,
    fetchFollowInfo,
  };
}

export default userApi;
