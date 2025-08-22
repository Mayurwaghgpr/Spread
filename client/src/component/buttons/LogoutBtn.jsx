import { useMutation } from "react-query";
import { setIsLogin, setloginPop, setUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useSocket from "../../hooks/useSocket";
import useIcons from "../../hooks/useIcons";

import Ibutton from "./Ibutton";
import { setToast } from "../../store/slices/uiSlice";
import useAuthApi from "../../services/useAuthApi";

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
      navigate("/heroes");
      disconnectSocket();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      dispatch(setToast({ message: "Logout failed:", type: "error" }));
    },
  });
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
