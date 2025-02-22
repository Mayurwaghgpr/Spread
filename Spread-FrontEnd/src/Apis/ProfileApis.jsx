import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function useProfileApi() {
  const fetchUserProfile = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response || error;
    }
  };
  const fetchUserData = async (profileId, pageParam) => {
    // console.log(profileId, pageParam);
    try {
      const response = await axios.get(`${BASE_URL}/user/posts/${profileId}`, {
        withCredentials: true,
        params: {
          limit: 3,
          lastTimestamp: pageParam,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const getArchivedPosts = async ({ pageParam }) => {
    try {
      const result = await axios.get(`${BASE_URL}/posts/archived`, {
        withCredentials: true,
        params: {
          lastTimestamp: pageParam,
          limit: 3,
        },
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
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
    } catch (error) {
      throw error.response || error;
    }
  };

  const editUserProfile = async (newData) => {
    const formData = new FormData();

    // Append Image Data
    if (newData.NewImageFile || newData.removeImage) {
      formData.append("userImage", newData.userImage);
    }
    if (newData.NewImageFile) {
      formData.append("NewImageFile", newData.NewImageFile);
    }
    if (newData.removeImage) {
      formData.append("removeImage", newData.removeImage);
    }

    // Append Profile Details
    formData.append("username", newData.username);
    formData.append("email", newData.email);
    formData.append("pronouns", newData.pronouns);
    formData.append("bio", newData.bio);
    formData.append("userFromOAth", Boolean(newData.userFromOAth));
    formData.append("cloudinaryPubId", newData.cloudinaryPubId);

    try {
      const response = await axios.post(
        `${BASE_URL}/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Uncomment the line below if token-based authentication is implemented
            // ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response ? error.response.data : error.message
      );
      throw error.response || error;
    }
  };
  const searchUsername = async (username) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/search/username`,
        username
      );
      return response.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    fetchUserData,
    fetchUserProfile,
    editUserProfile,
    searchUsername,
    getArchivedPosts,
    fetchFollowInfo,
  };
}
export default useProfileApi;
