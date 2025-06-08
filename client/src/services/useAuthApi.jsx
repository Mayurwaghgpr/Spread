import axiosInstance from "./axios";

function useAuthApi() {
  const loginUser = async (signinConfig) => {
    try {
      const result = await axiosInstance.post(`/auth/signin`, signinConfig);
      return result.data;
    } catch (error) {
      throw error;
    }
  };
  const getLogInUserData = async () => {
    try {
      const result = await axiosInstance.get(`/auth/details`);
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const registerUser = async (signUpcofig) => {
    try {
      const result = await axiosInstance.post(`/auth/signup`, signUpcofig);
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const refreshToken = async (params) => {
    try {
      const result = await axiosInstance.post(`/auth/refresh-token`);
      return result.data;
    } catch (error) {
      throw error.response || error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await axiosInstance.post(`/auth/forgotpassword`, email);
      return result.data;
    } catch (error) {
      throw error.response;
    }
  };

  const resetPasswordApi = async (newpassword, token) => {
    try {
      const result = await axiosInstance.put(
        `/auth/resetpassword/${token}`,
        newpassword
      );
      return result.data;
    } catch (error) {
      throw error.response;
    }
  };

  const logout = async () => {
    try {
      const result = await axiosInstance.delete(`/auth/logout`);
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

export default useAuthApi;
