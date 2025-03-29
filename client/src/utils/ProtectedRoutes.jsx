import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return isLogin ? children : navigate("/auth/signin");
};

export default memo(ProtectedRoute);
