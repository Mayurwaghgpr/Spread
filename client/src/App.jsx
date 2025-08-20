import React, {
  useEffect,
  Suspense,
  lazy,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MainNavBar from "./component/header/MainNavBar";
import ProtectedRoute from "./utils/ProtectedRoutes";
import LoaderScreen from "./component/loaders/loaderScreen";
import TaskBar from "./component/phoneview/TaskBar";
import SideBar from "./component/layout/SideBar";
import PersistentUser from "./utils/PersistentUser";
import useSocket from "./hooks/useSocket";
import Router from "./router/router";

// Lazy load components with better error boundaries
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const ForgotPass = lazy(() => import("./pages/auth/ForgotPass"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Home = lazy(() => import("./pages/home/Home"));
const Heroes = lazy(() => import("./pages/Landing/Heroes"));
const PageError = lazy(() => import("./pages/ErrorPages/ErrorPage"));
const Profile = lazy(() => import("./pages/userProfile/Profile"));
const DynamicPostEditor = lazy(
  () => import("./pages/PostEditor/DynamicPostEditor")
);
const PostPreviewEditor = lazy(
  () => import("./pages/PostEditor/component/PostPreviewEditor")
);
const PostView = lazy(() => import("./pages/PostView/PostView"));
const ProfileEditor = lazy(() => import("./pages/userProfile/ProfileEditor"));
const About = lazy(() => import("./pages/About"));
const ReadList = lazy(() => import("./pages/ReadList"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const General = lazy(() => import("./pages/settings/General"));
const ConfirmationBox = lazy(
  () => import("./component/utilityComp/ConfirmationBox")
);
const Messenger = lazy(() => import("./pages/Messages/Messenger"));
const MessageSection = lazy(() => import("./pages/Messages/MessageSection"));
const SearchBox = lazy(() => import("./pages/Search&Explorer/SearchBox"));
const CommentSection = lazy(() => import("./pages/Comment/CommentSection"));
const ToastContainer = lazy(
  () => import("./component/utilityComp/ToastContainer")
);
const Suggestions = lazy(() => import("./pages/home/Suggestions"));
const ConversationInfo = lazy(
  () => import("./pages/Messages/ConversationInfo")
);
const InfoSection = lazy(
  () => import("./pages/Messages/components/InfoSection")
);
const WelcomeLoginBox = lazy(
  () => import("./component/utilityComp/WelcomeLoginBox")
);
const SomethingWentWrong = lazy(
  () => import("./component/Errors/SomethingWentWrong")
);
const NewConversation = lazy(() => import("./pages/Messages/NewConversation"));
const ImageInBigFrame = lazy(
  () => import("./component/utilityComp/ImageInBigFrame")
);
const AIResponse = lazy(() => import("./component/aiComp/AiResponse"));
const MessageFallBack = lazy(
  () => import("./pages/Messages/components/MessageFallBack")
);
const NotificationBox = lazy(
  () => import("./component/notification/NotificationBox")
);
// Constants for better maintainability
const THEME_STORAGE_KEY = "ThemeMode";
const ROUTES = {
  HOME: "/",
  HEROES: "/heroes",
  PROFILE: "/profile/:username/:id",
  PROFILE_EDITOR: "/profileEditor",
  WRITE: "/write",
  SETTINGS: "/setting",
  MESSAGES: "/messages",
  POST_VIEW: "/view/:username/:id",
  SEARCH: "/search",
  SUGGESTIONS: "/suggestions/find_peoples",
  READ: "/Read",
  AUTH_SIGNIN: "/auth/signin",
  AUTH_SIGNUP: "/auth/signup",
  ABOUT: "/about",
  FORGOT_PASS: "/forgot/pass",
  RESET_PASS: "/reset/pass/:token",
  ERROR: "/error",
};

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isLogin, loginPop, user } = useSelector((state) => state.auth);
  const { ThemeMode } = useSelector((state) => state.ui);
  const { socket } = useSocket();

  const [systemTheme, setSystemTheme] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Memoize path checks for better performance
  const pathChecks = useMemo(
    () => ({
      isMessagesPath: pathname.startsWith("/messages"),
      isWritePath: pathname.startsWith("/write"),
      isSearchPath: pathname.startsWith("/search"),
      showSidebar:
        isLogin &&
        !pathname.startsWith("/write") &&
        // !pathname.startsWith("/messages") &&
        !pathname.startsWith("/search") &&
        !pathname.startsWith("/analysis") &&
        !pathname.startsWith("/view"),
    }),
    [pathname, isLogin]
  );

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      setSystemTheme(e.matches);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Handle socket registration
  useEffect(() => {
    if (socket && user?.id) {
      socket.emit("register", user.id);
    }
  }, [socket, user?.id]);

  // Handle theme changes
  useEffect(() => {
    const isDarkMode =
      ThemeMode === "dark" || (ThemeMode === "system" && systemTheme);
    document.documentElement.classList.toggle("dark", isDarkMode);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, ThemeMode);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  }, [ThemeMode, systemTheme]);

  return (
    <>
      <NotificationBox />
      <PersistentUser />
      <ConfirmationBox />
      {loginPop && <WelcomeLoginBox />}
      <ToastContainer />
      <ImageInBigFrame />
      <Router />
    </>
  );
}

export default App;
