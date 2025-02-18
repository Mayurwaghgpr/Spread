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
import TaskBar from "./component/phoneview/TaskBar";
import SideBar from "./component/homeComp/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Messanger from "./pages/Messages/Messanger";
import CommentSection from "./pages/Comment/CommentSection";
import SomthingWentWrong from "./pages/ErrorPages/somthingWentWrong";
import { PopupBox } from "./component/UtilityComp/PopupBox";
import Ibutton from "./component/buttons/Ibutton";
import { setloginPop } from "./redux/slices/authSlice";

// Lazy load components

const SignUp = lazy(() => import("./pages/auth/SignUp"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const ForgotPass = lazy(() => import("./pages/auth/ForgotPass"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Home = lazy(() => import("./pages/home/Home"));
const Heros = lazy(() => import("./pages/Heros"));
const PageError = lazy(() => import("./pages/ErrorPages/Page404"));
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
const Settings = lazy(() => import("./pages/settings/settings"));
const General = lazy(() => import("./pages/settings/General"));
const ConfirmationBox = lazy(
  () => import("./component/UtilityComp/ConfirmationBox")
);
const ScrollToTopButton = lazy(
  () => import("./component/UtilityComp/ScrollToTopButton")
);
const ToastContainer = lazy(
  () => import("./component/UtilityComp/ToastContainer")
);
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isLogin, loginPop } = useSelector((state) => state.auth);
  const { ThemeMode, MenuOpen } = useSelector((state) => state.ui);
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
    const isDarkMode =
      ThemeMode === "dark" || (ThemeMode === "system" && systemTheme);

    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("ThemeMode", ThemeMode);
  }, [ThemeMode, systemTheme]);

  return (
    <>
      {" "}
      <MainNavBar />
      <main className="flex justify-between items-center  border-inherit ">
        <ToastContainer />
        {<ConfirmationBox />}
        <Suspense fallback={<LoaderScreen />}>
          <PersistentUser />
          {isLogin &&
            !pathname.startsWith("/write") &&
            !pathname.startsWith("/messages") && <SideBar />}
          <Routes>
            <Route
              path="/"
              element={
                isLogin ? (
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                ) : (
                  <Navigate to="/heros" replace />
                )
              }
            >
              {" "}
              {/* <Route path="comments" element={<CommentSection />} /> */}
            </Route>
            <Route
              path="/heros"
              element={!isLogin ? <Heros /> : <Navigate to="/" replace />}
            />
            <Route path="/auth/signin" element={!isLogin && <SignIn />} />
            <Route path="/auth/signup" element={!isLogin && <SignUp />} />
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
                path="github/synch"
                element={<ProtectedRoute>{<div></div>}</ProtectedRoute>}
              />
            </Route>
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messanger />
                </ProtectedRoute>
              }
            />
            <Route path="/view/:username/:id" element={<PostView />}>
              <Route path="comments" element={<CommentSection />} />
            </Route>
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <SearchBar />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageError />} />
            <Route
              path="/Read"
              element={
                <ProtectedRoute>
                  <ReadList />
                </ProtectedRoute>
              }
            />

            <Route path="/ForgotPass" element={<ForgotPass />} />
            <Route path="/Resetpassword/:token" element={<ResetPassword />} />
            <Route path="/error" element={<SomthingWentWrong />} />
          </Routes>
          {isLogin && <TaskBar />}
          {loginPop && (
            <PopupBox
              className={
                "flex flex-col justify-center gap-4 text-center sm:text-lg text-sm items-center p-10 border-inherit max-w-[25rem] min-h-[50%]"
              }
              heading={"Hey there!"}
              subText={
                "Let start exploring and sharing,Sign In or Sign Up,learn,analyze and more"
              }
              children={
                <>
                  <Ibutton
                    className={
                      "bg-white text-black   py-2 text-center border border-inherit  w-full "
                    }
                    innerText={"LogIn"}
                    action={() => {
                      navigate("/auth/signIn", { replace: true });
                      dispatch(setloginPop(false));
                    }}
                  />
                  <Ibutton
                    className={
                      "bg-white text-black text-center py-2 border border-inherit  w-full"
                    }
                    innerText={"SignUp"}
                    action={() => {
                      navigate("/auth/signUp", { replace: true });
                      dispatch(setloginPop(false));
                    }}
                  />
                </>
              }
            />
          )}
        </Suspense>
        <ConfirmationBox />

        {/* <ScrollToTopButton /> */}
      </main>
    </>
  );
}

export default App;
