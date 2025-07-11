import React from "react";
import { LuLogOut } from "react-icons/lu";
import { useMutation } from "react-query";
import { setIsLogin, setloginPop, setUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SomthingWentWrong from "../Errors/SomethingWentWrong";
import useAuthApi from "../../services/useAuthApi";
import { useDispatch } from "react-redux";
import LoaderScreen from "../loaders/loaderScreen";
import useSocket from "../../hooks/useSocket";
import useIcons from "../../hooks/useIcons";
import LinkBtn from "../LinkBtn";
import Ibutton from "./Ibutton";

function LogoutBtn({ className }) {
  const { socket, disconnectSocket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuthApi();
  const icons = useIcons();

  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("AccessToken"); //if it is stored in localStorage
      localStorage.removeItem("userAccount"); //if it is stored in localStorage
      dispatch(setIsLogin(false));
      dispatch(setUser(null));
      dispatch(setloginPop(true));
      navigate("/");
      disconnectSocket();
    },
    onError: () => {
      <SomthingWentWrong />;
    },
  });

  if (isLoading) {
    return <LoaderScreen message={"logging out..."} />;
  }
  return (
    <Ibutton
      action={mutate}
      type="button"
      aria-label="Logout"
      className={className}
    >
      {icons["logout"]}

      <span className=" xl:block sm:hidden block ">Sign out</span>
    </Ibutton>
  );
}

export default LogoutBtn;
