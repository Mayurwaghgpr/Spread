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
      return error.response;
    }
  };
  const fetchUserData = async (profileId, pageParam) => {
    console.log(profileId, pageParam);
    try {
      const response = await axios.get(`${BASE_URL}/user/posts/${profileId}`, {
        withCredentials: true,
        params: {
          limit: 3,
          page: pageParam,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        localStorage.removeItem("AccessToken");
      }
      console.log(error.response);
      if (error.response && error.response.status === 404) {
        throw new Error(error.response.status);
      }
      throw new Error(error.response);
    }
  };

  const EditeUserProfile = async (newData) => {
    const formData = new FormData();

    if (
      newData.userImage &&
      newData.userImage !== "null" &&
      newData.NewImageFile
    ) {
      formData.append("userImage", newData.userImage);
    }
    if (newData.NewImageFile) {
      formData.append("NewImageFile", newData.NewImageFile);
    }

    if (newData.removeImage) {
      formData.append("userImage", newData.userImage);
      formData.append("removeImage", newData.removeImage);
    }
    formData.append("username", newData.username);
    formData.append("email", newData.email);
    formData.append("pronouns", newData.pronouns);
    formData.append("bio", newData.bio);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/profile/edit`,
        formData,
        {
          headers: {
            // Uncomment if you have a method to get the token
            // Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
      throw err;
    }
  };
  return { fetchUserData, fetchUserProfile, EditeUserProfile };
}
export default useProfileApi;
