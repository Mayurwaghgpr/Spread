import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const LoginUser = async (signinConfig) => {
  try {
    const result = await axios.post(`${BASE_URL}/auth/signin`, signinConfig, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const RegisterUser = async (signUpcofig) => {
  try {
    const result = await axios.post(`${BASE_URL}/auth/signup`, signUpcofig, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const result = await axios.post(`${BASE_URL}/auth/forgotpassword`, email);
    return result.data;
  } catch (error) {
    throw error.response;
  }
};

export const ResetPasswordApi = async (newpassword, token) => {
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
