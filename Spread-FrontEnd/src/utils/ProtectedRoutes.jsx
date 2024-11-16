import React, { memo, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToast } from "../redux/slices/uiSlice";

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return !isLogin ? <Navigate to="/auth/signin" replace /> : children;
};

export default memo(ProtectedRoute);
