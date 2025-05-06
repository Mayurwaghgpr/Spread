import { memo } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { setIsLogin, setUser } from "../redux/slices/authSlice";
import useAuthApi from "../Apis/useAuthApi";

function PersistentUser({ children }) {
  // const navigate = useNavigate();
  // const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { refreshToken, getLogInUserData } = useAuthApi();

  const { error, isError } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getLogInUserData(),
    onSuccess: (data) => {
      localStorage.setItem("AccessToken", true);
      dispatch(setIsLogin(true));
      dispatch(setUser(JSON.parse(data) || data));
    },
    onError: (error) => {
      console.error("Error fetching logged-in user data:", error);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return children;
}

export default memo(PersistentUser);
