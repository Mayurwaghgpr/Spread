import React, { memo, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToast } from "../redux/slices/uiSlice";

const ProtectedRoute = ({ children }) => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLogin && user) {
    return children;
  } else {
    navigate("/auth/signin");
  }
};

export default memo(ProtectedRoute);
