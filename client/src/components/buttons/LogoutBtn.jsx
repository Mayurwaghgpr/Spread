import { useMutation } from "@tanstack/react-query";
import { setIsLogin, setloginPop, setUser, setIsLoggingOut } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useSocket from "../../hooks/useSocket";
import useIcons from "../../hooks/useIcons";
import Ibutton from "./Ibutton";
import { setToast } from "../../store/slices/uiSlice";
import useAuthApi from "../../services/useAuthApi";

function LogoutBtn({ className }) {
  const { disconnectSocket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuthApi();
  const icons = useIcons();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("AccessToken");
      localStorage.removeItem("userAccount");
      dispatch(setIsLogin(false));
      dispatch(setUser(null));
      dispatch(setloginPop(false));

      // Navigate to landing page
      navigate("/heroes");
      disconnectSocket();

      // Clear logging out overlay after transition
      setTimeout(() => {
        dispatch(setIsLoggingOut(false));
      }, 500);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      dispatch(setIsLoggingOut(false));
      dispatch(setToast({ message: "Logout failed", type: "error" }));
    },
  });

  const handleLogout = () => {
    dispatch(setIsLoggingOut(true));
    mutate();
  };

  return (
    <Ibutton
      action={handleLogout}
      type="button"
      aria-label="Logout"
      disabled={isLoading}
      className={className}
    >
      {icons["logout"]}
      <span className="xl:block sm:hidden block">Sign out</span>
    </Ibutton>
  );
}

export default LogoutBtn;
