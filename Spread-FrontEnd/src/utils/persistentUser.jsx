import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import userApi from "../Apis/userApi";
import { setIsLogin, setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SomthingWentWrong from "../pages/ErrorPages/somthingWentWrong";

function PersistentUser() {
  const { getLogInUserData } = userApi();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { error, isError } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getLogInUserData(),
    onSuccess: (data) => {
      localStorage.setItem("AccessToken", true);
      console.log("user login data:", data);
      dispatch(setIsLogin(true));
      dispatch(setUser(JSON.parse(data)));
    },
    onError: (error) => {
      if (error.status === 404) {
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
