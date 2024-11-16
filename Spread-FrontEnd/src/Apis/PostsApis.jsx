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

  const DeletePostApi = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/posts/delete/${id.trim()}`,
        {
          withCredentials: true,
        }
      );
      console.log("DeletePostApi response:", response);
      return response.data; // Return the actual data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("userAccount");
        localStorage.removeItem("AccessToken");
      }
      throw error;
    }
  };

  return { DeletePostApi, AddNewPost, fetchDataAll };
}

export default PostsApis;
