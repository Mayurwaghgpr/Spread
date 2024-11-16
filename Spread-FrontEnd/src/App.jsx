import React, { useEffect, Suspense, lazy, useMemo, useState } from "react";
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
import PersistentUser from "./utils/persistentUser";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoaderScreen from "./component/loaders/loaderScreen";
import SearchBar from "./component/homeComp/searchBar";

// Lazy load components

const SignUp = lazy(() => import("./pages/auth/SignUp"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const ForgotPass = lazy(() => import("./pages/auth/ForgotPass"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ViewBlogs = lazy(() => import("./pages/ViewBlogs"));
const Home = lazy(() => import("./pages/Home"));
const PageError = lazy(() => import("./pages/ErrorPages/Page404"));
const Profile = lazy(() => import("./pages/userProfile/Profile"));
const DynamicPostEditor = lazy(
  () => import("./pages/PostEditor/DynamicPostEditor")
);
const PostPreviewEditor = lazy(
  () => import("./pages/PostEditor/component/PostPreviewEditor")
);
const FullBlogView = lazy(() => import("./pages/FullBlogView/FullBlogView"));
const ProfileEditor = lazy(() => import("./pages/userProfile/ProfileEditor"));
const About = lazy(() => import("./pages/About"));
const ReadList = lazy(() => import("./pages/ReadList"));
const Settings = lazy(() => import("./pages/settings/settings"));
const General = lazy(() => import("./pages/settings/General"));
const ConfirmationBox = lazy(
  () => import("./component/otherUtilityComp/ConfirmationBox")
);
const ScrollToTopButton = lazy(
  () => import("./component/otherUtilityComp/ScrollToTopButton")
);
const ToastContainer = lazy(
  () => import("./component/otherUtilityComp/ToastContainer")
);
function App() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const location = useLocation();
  const { isLogin } = useSelector((state) => state.auth);
  const { ThemeMode } = useSelector((state) => state.ui);
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      setSystemTheme(e.matches); // Update state when system theme changes
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Cleanup event listener when component unmounts
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  // Handle dark mode based on ThemeMode
  useMemo(() => {
    if (ThemeMode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ThemeMode", "dark");
    } else if (ThemeMode === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ThemeMode", "light");
    } else if (ThemeMode === "system") {
      if (systemTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [ThemeMode, systemTheme]);

  return (
    <>
      <ToastContainer />
      <PersistentUser />
      {<ConfirmationBox />}
      <Suspense fallback={<LoaderScreen />}>
        <MainNavBar />
        <Routes>
          <Route
            path="/"
            element={
              !isLogin ? (
                <Home />
              ) : (
                <ProtectedRoute>
                  <ViewBlogs />
                </ProtectedRoute>
              )
            }
          />
          <Route
            path="/auth/signin"
            element={!isLogin ? <SignIn /> : <Navigate to="/" replace />}
          />
          <Route
            path="/auth/signup"
            element={!isLogin ? <SignUp /> : <Navigate to="/" replace />}
          />
          <Route path="/about" element={<About />} />

          <Route
            path="/profile/:username/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profileEditor"
            element={
              <ProtectedRoute>
                <ProfileEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <DynamicPostEditor />
              </ProtectedRoute>
            }
          >
            <Route path="/write/publish" element={<PostPreviewEditor />} />
          </Route>
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          >
            <Route
              path=""
              element={
                <ProtectedRoute>
                  <General />
                </ProtectedRoute>
              }
            />
            <Route
              path="githubSynch"
              element={<ProtectedRoute>{<div></div>}</ProtectedRoute>}
            />
          </Route>
          <Route
            path="/FullView/:username/:id"
            element={
              <ProtectedRoute>
                <FullBlogView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <SearchBar />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageError />} />
          <Route path="/Read" element={<ReadList />} />
          <Route path="/ForgotPass" element={<ForgotPass />} />
          <Route path="/Resetpassword/:token" element={<ResetPassword />} />
        </Routes>
      </Suspense>
      <ConfirmationBox />
      {/* <ScrollToTopButton /> */}
    </>
  );
}

export default App;
