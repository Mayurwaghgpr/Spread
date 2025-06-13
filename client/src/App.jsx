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
import "bootstrap-icons/font/bootstrap-icons.css";
import LoaderScreen from "./component/loaders/loaderScreen";
import TaskBar from "./component/phoneview/TaskBar";
import SideBar from "./component/layout/SideBar";
import PersistentUser from "./utils/PersistentUser";
import useSocket from "./hooks/useSocket";
import NotificationBox from "./component/notification/NotificationBox";
import Suggestions from "./pages/home/Suggestions";
import ConversationInfo from "./pages/Messages/ConversationInfo";
import InfoSection from "./pages/Messages/components/InfoSection";
import WelcomeLoginBox from "./component/utilityComp/WelcomeLoginBox";
import SomethingWentWrong from "./component/Errors/SomethingWentWrong";
import NewConversation from "./pages/Messages/NewConversation";
import ImageInBigFrame from "./component/utilityComp/ImageInBigFrame";

// Lazy load components with better error boundaries
const SignUp = lazy(() =>
  import("./pages/auth/SignUp").catch(() => ({
    default: () => <div>Error loading SignUp</div>,
  }))
);
const SignIn = lazy(() =>
  import("./pages/auth/SignIn").catch(() => ({
    default: () => <div>Error loading SignIn</div>,
  }))
);
const ForgotPass = lazy(() =>
  import("./pages/auth/ForgotPass").catch(() => ({
    default: () => <div>Error loading ForgotPass</div>,
  }))
);
const ResetPassword = lazy(() =>
  import("./pages/auth/ResetPassword").catch(() => ({
    default: () => <div>Error loading ResetPassword</div>,
  }))
);
const Home = lazy(() =>
  import("./pages/home/Home").catch(() => ({
    default: () => <div>Error loading Home</div>,
  }))
);
const Heroes = lazy(() =>
  import("./pages/Heroes").catch(() => ({
    default: () => <div>Error loading Heroes</div>,
  }))
);
const PageError = lazy(() =>
  import("./pages/ErrorPages/ErrorPage").catch(() => ({
    default: () => <div>Error loading PageError</div>,
  }))
);
const Profile = lazy(() =>
  import("./pages/userProfile/Profile").catch(() => ({
    default: () => <div>Error loading Profile</div>,
  }))
);
const DynamicPostEditor = lazy(() =>
  import("./pages/PostEditor/DynamicPostEditor").catch(() => ({
    default: () => <div>Error loading DynamicPostEditor</div>,
  }))
);
const PostPreviewEditor = lazy(() =>
  import("./pages/PostEditor/component/PostPreviewEditor").catch(() => ({
    default: () => <div>Error loading PostPreviewEditor</div>,
  }))
);
const PostView = lazy(() =>
  import("./pages/PostView/PostView").catch(() => ({
    default: () => <div>Error loading PostView</div>,
  }))
);
const ProfileEditor = lazy(() =>
  import("./pages/userProfile/ProfileEditor").catch(() => ({
    default: () => <div>Error loading ProfileEditor</div>,
  }))
);
const About = lazy(() =>
  import("./pages/About").catch(() => ({
    default: () => <div>Error loading About</div>,
  }))
);
const ReadList = lazy(() =>
  import("./pages/ReadList").catch(() => ({
    default: () => <div>Error loading ReadList</div>,
  }))
);
const Settings = lazy(() =>
  import("./pages/settings/Settings").catch(() => ({
    default: () => <div>Error loading Settings</div>,
  }))
);
const General = lazy(() =>
  import("./pages/settings/General").catch(() => ({
    default: () => <div>Error loading General</div>,
  }))
);
const ConfirmationBox = lazy(() =>
  import("./component/utilityComp/ConfirmationBox").catch(() => ({
    default: () => <div>Error loading ConfirmationBox</div>,
  }))
);
const Messenger = lazy(() =>
  import("./pages/Messages/Messenger").catch(() => ({
    default: () => <div>Error loading Messenger</div>,
  }))
);
const MessageSection = lazy(() =>
  import("./pages/Messages/MessageSection").catch(() => ({
    default: () => <div>Error loading MessageSection</div>,
  }))
);
const SearchBox = lazy(() =>
  import("./pages/Search&Explorer/SearchBox").catch(() => ({
    default: () => <div>Error loading SearchBox</div>,
  }))
);
const CommentSection = lazy(() =>
  import("./pages/Comment/CommentSection").catch(() => ({
    default: () => <div>Error loading CommentSection</div>,
  }))
);
const ToastContainer = lazy(() =>
  import("./component/utilityComp/ToastContainer").catch(() => ({
    default: () => <div>Error loading ToastContainer</div>,
  }))
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
        !pathname.startsWith("/messages") &&
        !pathname.startsWith("/search"),
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

  // Memoize protected route wrapper to avoid re-renders
  const ProtectedRouteWrapper = useCallback(
    ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    []
  );

  return (
    <>
      {!pathChecks.isMessagesPath && <MainNavBar />}

      <main className="relative flex justify-between items-center border-inherit">
        <NotificationBox />

        <Suspense fallback={<LoaderScreen />}>
          <PersistentUser />
          <ConfirmationBox />

          {pathChecks.showSidebar && <SideBar />}

          <Routes>
            {/* Home Route */}
            <Route
              path={ROUTES.HOME}
              element={
                isLogin ? (
                  <ProtectedRouteWrapper>
                    <Home />
                  </ProtectedRouteWrapper>
                ) : (
                  <Navigate to={ROUTES.HEROES} replace />
                )
              }
            />

            {/* Public Routes */}
            <Route
              path={ROUTES.HEROES}
              element={
                !isLogin ? <Heroes /> : <Navigate to={ROUTES.HOME} replace />
              }
            />

            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.FORGOT_PASS} element={<ForgotPass />} />
            <Route path={ROUTES.RESET_PASS} element={<ResetPassword />} />
            <Route path={ROUTES.ERROR} element={<SomethingWentWrong />} />

            {/* Auth Routes */}
            <Route
              path={ROUTES.AUTH_SIGNIN}
              element={
                !isLogin ? <SignIn /> : <Navigate to={ROUTES.HOME} replace />
              }
            />
            <Route
              path={ROUTES.AUTH_SIGNUP}
              element={
                !isLogin ? <SignUp /> : <Navigate to={ROUTES.HOME} replace />
              }
            />

            {/* Protected Routes */}
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRouteWrapper>
                  <Profile />
                </ProtectedRouteWrapper>
              }
            />

            <Route
              path={ROUTES.PROFILE_EDITOR}
              element={
                <ProtectedRouteWrapper>
                  <ProfileEditor />
                </ProtectedRouteWrapper>
              }
            />

            {/* Post Editor Routes */}
            <Route
              path={ROUTES.WRITE}
              element={
                <ProtectedRouteWrapper>
                  <DynamicPostEditor />
                </ProtectedRouteWrapper>
              }
            >
              <Route path="publish" element={<PostPreviewEditor />} />
            </Route>

            {/* Settings Routes */}
            <Route
              path={ROUTES.SETTINGS}
              element={
                <ProtectedRouteWrapper>
                  <Settings />
                </ProtectedRouteWrapper>
              }
            >
              <Route
                index
                element={
                  <ProtectedRouteWrapper>
                    <General />
                  </ProtectedRouteWrapper>
                }
              />
              <Route
                path="github/sync"
                element={
                  <ProtectedRouteWrapper>
                    <div>GitHub Sync Feature Coming Soon</div>
                  </ProtectedRouteWrapper>
                }
              />
            </Route>

            {/* Messages Routes */}
            <Route
              path={ROUTES.MESSAGES}
              element={
                <ProtectedRouteWrapper>
                  <Messenger />
                </ProtectedRouteWrapper>
              }
            >
              <Route path="new/c" element={<NewConversation />} />
              <Route path="c" element={<MessageSection />}>
                <Route path="info" element={<ConversationInfo />}>
                  <Route index element={<InfoSection />} />
                </Route>
              </Route>
            </Route>

            {/* Post View Routes */}
            <Route path={ROUTES.POST_VIEW} element={<PostView />}>
              <Route path="comments" element={<CommentSection />} />
            </Route>

            {/* Other Protected Routes */}
            <Route
              path={ROUTES.SEARCH}
              element={
                <ProtectedRouteWrapper>
                  <SearchBox />
                </ProtectedRouteWrapper>
              }
            />

            <Route
              path={ROUTES.READ}
              element={
                <ProtectedRouteWrapper>
                  <ReadList />
                </ProtectedRouteWrapper>
              }
            />

            <Route path={ROUTES.SUGGESTIONS} element={<Suggestions />} />

            {/* Catch-all route */}
            <Route path="*" element={<PageError />} />
          </Routes>

          {loginPop && <WelcomeLoginBox />}
          <ToastContainer />
          <ImageInBigFrame />
        </Suspense>
      </main>

      {isLogin && !pathChecks.isMessagesPath && <TaskBar />}
    </>
  );
}

export default App;
