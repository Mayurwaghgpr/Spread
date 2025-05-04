import React, { useEffect, Suspense, lazy, useState, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MainNavBar from "./component/header/MainNavBar";
import ProtectedRoute from "./utils/ProtectedRoutes";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoaderScreen from "./component/loaders/loaderScreen";
import TaskBar from "./component/phoneview/TaskBar";
import SideBar from "./component/homeComp/SideBar";
import SomthingWentWrong from "./pages/ErrorPages/somthingWentWrong";
import { PopupBox } from "./component/utilityComp/PopupBox";
import { setloginPop } from "./redux/slices/authSlice";
import PersistantUser from "./utils/PersistentUser";
import useSocket from "./hooks/useSocket";
import Notifictionbox from "./component/notification/Notifictionbox";
import Suggetions from "./pages/home/Suggetions";
import ConversationInfo from "./pages/Messages/ConversationInfo";
import InfoSection from "./pages/Messages/components/InfoSection";

// Lazy load components

const SignUp = lazy(() => import("./pages/auth/SignUp"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const ForgotPass = lazy(() => import("./pages/auth/ForgotPass"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Home = lazy(() => import("./pages/home/Home"));
const Heros = lazy(() => import("./pages/Heros"));
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
const Messanger = lazy(() => import("./pages/Messages/Messanger"));
const MessageSection = lazy(() => import("./pages/Messages/MessageSection"));
const SearchBox = lazy(() => import("./pages/Seach&Explorer/SearchBox"));
const CommentSection = lazy(() => import("./pages/Comment/CommentSection"));
const ToastContainer = lazy(
  () => import("./component/utilityComp/ToastContainer")
);
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isLogin, loginPop, user } = useSelector((state) => state.auth);
  const { ThemeMode } = useSelector((state) => state.ui);
  const { socket } = useSocket();

  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    // register user to web socket
    socket?.emit("register", user.id);
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
  useCallback(() => {
    const isDarkMode =
      ThemeMode === "dark" || (ThemeMode === "system" && systemTheme);
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("ThemeMode", ThemeMode);
  }, [ThemeMode, systemTheme, dispatch]);

  return (
    <>
      {" "}
      {!pathname.startsWith("/messages") && <MainNavBar />}
      <main className=" relative flex justify-between items-center border-inherit ">
        <Notifictionbox />
        {<ConfirmationBox />}
        <Suspense fallback={<LoaderScreen />}>
          <PersistantUser />
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
              {/* <Route path="comments" element={<CommentSection />}  */}
            </Route>
            <Route
              path="/heros"
              element={!isLogin ? <Heros /> : <Navigate to="/" replace />}
            />
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
            >
              <Route path="c" element={<MessageSection />}>
                <Route path="Info" element={<ConversationInfo />}>
                  <Route path="" element={<InfoSection />} />
                </Route>
              </Route>
            </Route>
            <Route path="/view/:username/:id" element={<PostView />}>
              <Route path="comments" element={<CommentSection />} />
            </Route>
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchBox />
                </ProtectedRoute>
              }
            />
            <Route path="/suggetions/find_peoples" element={<Suggetions />} />
            <Route path="*" element={<PageError />} />
            <Route
              path="/Read"
              element={
                <ProtectedRoute>
                  <ReadList />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/auth/signin"
              element={!isLogin ? <SignIn /> : <Navigate to={"/"} />}
            />
            <Route
              path="/auth/signup"
              element={!isLogin ? <SignUp /> : <Navigate to={"/"} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/forgot/pass" element={<ForgotPass />} />
            <Route path="/reset/pass/:token" element={<ResetPassword />} />
            <Route path="/error" element={<SomthingWentWrong />} />
          </Routes>

          {loginPop && (
            <PopupBox
              action={() => dispatch(setloginPop(false))}
              className={
                "flex flex-col justify-center gap-4 text-center  items-center p-10 border-inherit max-w-[25rem] min-h-[50%] shadow-lg"
              }
            >
              <h1 className="text-3xl font-semibold">Hey there!</h1>
              <p className="opacity-50 font-light">
                Let start exploring and sharing,Sign In or Sign Up,learn,analyze
                and more
              </p>{" "}
              <Link
                onClick={() => {
                  dispatch(setloginPop(false));
                }}
                replace
                className={
                  "text-white bg-black dark:bg-white dark:text-black py-2 text-center border-2 hover:opacity-60 border-inherit w-full rounded-full "
                }
                to={"/auth/signIn"}
              >
                Sign In
              </Link>
              <Link
                onClick={() => {
                  dispatch(setloginPop(false));
                }}
                className={
                  "  text-center py-2 border border-inherit  w-full rounded-full"
                }
                replace
                to={"/auth/signUp"}
              >
                Sign Up
              </Link>
            </PopupBox>
          )}
        </Suspense>
        <ToastContainer />
        <ConfirmationBox />

        {/* <ScrollToTopButton /> */}
      </main>
      {isLogin && !pathname.startsWith("/messages") && <TaskBar />}
    </>
  );
}

export default App;
