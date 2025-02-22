import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
function useAuth() {
  const loginUser = async (signinConfig) => {
    try {
      const result = await axios.post(`${BASE_URL}/auth/signin`, signinConfig, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  };
  const getLogInUserData = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/auth/details`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const registerUser = async (signUpcofig) => {
    try {
      const result = await axios.post(`${BASE_URL}/auth/signup`, signUpcofig, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const refreshToken = async (params) => {
    try {
      const result = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await axios.post(`${BASE_URL}/auth/forgotpassword`, email);
      return result.data;
    } catch (error) {
      throw error.response;
    }
  };

  const resetPasswordApi = async (newpassword, token) => {
    try {
      const result = await axios.put(
        `${BASE_URL}/auth/resetpassword/${token}`,
        newpassword
      );
      return result.data;
    } catch (error) {
      throw error.response;
    }
  };

  const logout = async () => {
    try {
      const result = await axios.delete(`${BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      throw error.response;
    }
  };
  return {
    loginUser,
    getLogInUserData,
    registerUser,
    refreshToken,
    forgotPassword,
    resetPasswordApi,
    logout,
  };
}

export default useAuth;
