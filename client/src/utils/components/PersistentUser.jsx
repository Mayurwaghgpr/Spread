import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { setIsLogin, setUser } from "../../store/slices/authSlice";
import useAuthApi from "../../services/useAuthApi";
import { useNavigate } from "react-router-dom";

function PersistentUser({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getLogInUserData } = useAuthApi();

  const { data, error, isError, isSuccess } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: getLogInUserData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry on auth failure
  });

  // Handle successful authentication
  useEffect(() => {
    if (isSuccess && data) {
      console.log("PersistentUser: User authenticated successfully", data);
      dispatch(setIsLogin(true));
      dispatch(setUser(typeof data === 'string' ? JSON.parse(data) : data));
    }
  }, [isSuccess, data, dispatch]);

  // Handle authentication errors
  useEffect(() => {
    if (isError) {
      console.error("PersistentUser: Authentication failed", error);
      dispatch(setIsLogin(false));
      dispatch(setUser(null));

      // If we're on a protected route and get 401, redirect to heroes page
      const currentPath = window.location.pathname;
      const publicPaths = [
        "/heroes",
        "/auth/signin",
        "/auth/signup",
        "/about",
        "/forgot/pass",
        "/reset/pass",
      ];
      const isPublicPath = publicPaths.some((path) =>
        currentPath.startsWith(path),
      );

      if (!isPublicPath && error?.response?.status === 401) {
        navigate("/heroes", { replace: true });
      }
    }
  }, [isError, error, dispatch, navigate]);

  return children;
}

export default memo(PersistentUser);
