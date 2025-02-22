import React from "react";
import { LuLogOut } from "react-icons/lu";
import { useMutation } from "react-query";
import { setIsLogin, setloginPop, setUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SomthingWentWrong from "../../pages/ErrorPages/somthingWentWrong";
import useAuth from "../../Apis/useAuth";
import { useDispatch } from "react-redux";
import LoaderScreen from "../loaders/loaderScreen";

function LogoutBtn({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("AccessToken"); //if it is stored in localStorage
      localStorage.removeItem("userAccount"); //if it is stored in localStorage
      dispatch(setIsLogin(false));
      dispatch(setUser(null));
      dispatch(setloginPop(true));
      navigate("/");
    },
    onError: () => {
      <SomthingWentWrong />;
    },
  });

  if (isLoading) {
    return <LoaderScreen message={"logging out..."} />;
  }
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
