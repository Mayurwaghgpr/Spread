import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLogin, setUser } from "../redux/slices/authSlice";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/auth/logout`, null, {
        withCredentials: true,
      });
      dispatch(setIsLogin(false));
      dispatch(setUser(null));
      localStorage.removeItem("AccessToken");
      localStorage.removeItem("userAccount");
      if (result) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export default useLogout;
