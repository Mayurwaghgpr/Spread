import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { setIsLogin, setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import authApi from "../Apis/authapi";

function PersistentUser() {
  // const navigate = useNavigate();
  // const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { refreshToken, getLogInUserData } = authApi();
  const { error, isError } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getLogInUserData(),
    onSuccess: (data) => {
      localStorage.setItem("AccessToken", true);
      dispatch(setUser(JSON.parse(data)));
    },
    onError: (error) => {
      if (error.status === 401) {
        const respons = refreshToken();
        console.log(respons);
        dispatch(setIsLogin(false));
        return localStorage.removeItem("AccessToken");
      }
      console.error("Error fetching logged-in user data:", error);
    },
    refetchOnWindowFocus: false,
  });
  return null;
}

export default memo(PersistentUser);
