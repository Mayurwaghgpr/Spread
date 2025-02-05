import React from "react";
import { LuLogOut } from "react-icons/lu";
import { useMutation } from "react-query";
import { setIsLogin, setUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SomthingWentWrong from "../../pages/ErrorPages/somthingWentWrong";
import { Logout } from "../../Apis/authapi";
import { useDispatch } from "react-redux";

function LogoutBtn({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate, isLoading } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      localStorage.removeItem("AccessToken"); //if it is stored in localStorage
      localStorage.removeItem("userAccount"); //if it is stored in localStorage
      dispatch(setIsLogin(false));
      dispatch(setUser(null));

      navigate("/");
    },
    onError: () => {
      <SomthingWentWrong />;
    },
  });
  return (
    <button
      onClick={mutate}
      type="button"
      aria-label="Logout"
      className={className}
    >
      <LuLogOut className="" />
      <span className=" xl:block sm:hidden block ">Sign out</span>
    </button>
  );
}

export default LogoutBtn;
