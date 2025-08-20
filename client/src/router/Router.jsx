import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../component/layout/Layout";
import { useSelector } from "react-redux";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import LoaderScreen from "../component/loaders/loaderScreen";
// Lazy load components with better error boundaries
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const ForgotPass = lazy(() => import("../pages/auth/ForgotPass"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Home = lazy(() => import("../pages/home/Home"));
const Heroes = lazy(() => import("../pages/Landing/Heroes"));
const PageError = lazy(() => import("../pages/ErrorPages/ErrorPage"));
const Profile = lazy(() => import("../pages/userProfile/Profile"));
const DynamicPostEditor = lazy(
  () => import("../pages/PostEditor/DynamicPostEditor")
);
const PostPreviewEditor = lazy(
  () => import("../pages/PostEditor/component/PostPreviewEditor")
);
const PostView = lazy(() => import("../pages/PostView/PostView"));
const ProfileEditor = lazy(() => import("../pages/userProfile/ProfileEditor"));
const About = lazy(() => import("../pages/About"));
const ReadList = lazy(() => import("../pages/ReadList"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const General = lazy(() => import("../pages/settings/General"));
const ConfirmationBox = lazy(
  () => import("../component/utilityComp/ConfirmationBox")
);
const Messenger = lazy(() => import("../pages/Messages/Messenger"));
const MessageSection = lazy(() => import("../pages/Messages/MessageSection"));
const SearchBox = lazy(() => import("../pages/Search&Explorer/SearchBox"));
const CommentSection = lazy(() => import("../pages/Comment/CommentSection"));
const ToastContainer = lazy(
  () => import("../component/utilityComp/ToastContainer")
);
const Suggestions = lazy(() => import("../pages/home/Suggestions"));
const ConversationInfo = lazy(
  () => import("../pages/Messages/ConversationInfo")
);
const InfoSection = lazy(
  () => import("../pages/Messages/components/InfoSection")
);
const WelcomeLoginBox = lazy(
  () => import("../component/utilityComp/WelcomeLoginBox")
);
const SomethingWentWrong = lazy(
  () => import("../component/Errors/SomethingWentWrong")
);
const NewConversation = lazy(() => import("../pages/Messages/NewConversation"));
const ImageInBigFrame = lazy(
  () => import("../component/utilityComp/ImageInBigFrame")
);
const AIResponse = lazy(() => import("../component/aiComp/AiResponse"));
const MessageFallBack = lazy(
  () => import("../pages/Messages/components/MessageFallBack")
);

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
function Router() {
  const { isLogin, loginPop, user } = useSelector((state) => state.auth);
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path={ROUTES.HEROES}
        element={
          !isLogin ? (
            <Suspense fallback={<LoaderScreen />}>
              <Heroes />
            </Suspense>
          ) : (
            <Navigate to={ROUTES.HOME} replace />
          )
        }
      />
      {/* Auth Routes */}
      <Route
        path={ROUTES.AUTH_SIGNIN}
        element={
          !isLogin ? (
            <Suspense fallback={<LoaderScreen />}>
              <SignIn />
            </Suspense>
          ) : (
            <Navigate to={ROUTES.HOME} replace />
          )
        }
      />
      <Route
        path={ROUTES.AUTH_SIGNUP}
        element={
          !isLogin ? (
            <Suspense fallback={<LoaderScreen />}>
              <SignUp />
            </Suspense>
          ) : (
            <Navigate to={ROUTES.HOME} replace />
          )
        }
      />

      <Route path="/" element={<Layout />}>
        {/* Home Route */}
        <Route
          path={ROUTES.HOME}
          element={
            isLogin ? (
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            ) : (
              <Navigate to={ROUTES.HEROES} replace />
            )
          }
        />

        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.FORGOT_PASS} element={<ForgotPass />} />
        <Route path={ROUTES.RESET_PASS} element={<ResetPassword />} />
        <Route path={ROUTES.ERROR} element={<SomethingWentWrong />} />

        {/* Protected Routes */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        <Route
          path={ROUTES.PROFILE_EDITOR}
          element={
            <ProtectedRoutes>
              <ProfileEditor />
            </ProtectedRoutes>
          }
        />

        {/* Post Editor Routes */}
        <Route
          path={ROUTES.WRITE}
          element={
            <ProtectedRoutes>
              <DynamicPostEditor />
            </ProtectedRoutes>
          }
        >
          <Route path="publish" element={<PostPreviewEditor />} />
        </Route>

        {/* Settings Routes */}
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoutes>
              <Settings />
            </ProtectedRoutes>
          }
        >
          <Route
            index
            element={
              <ProtectedRoutes>
                <General />
              </ProtectedRoutes>
            }
          />
          <Route
            path="github/sync"
            element={
              <ProtectedRoutes>
                <div>GitHub Sync Feature Coming Soon</div>
              </ProtectedRoutes>
            }
          />
        </Route>

        {/* Messages Routes */}
        <Route
          path={ROUTES.MESSAGES}
          element={
            <ProtectedRoutes>
              <Messenger />
            </ProtectedRoutes>
          }
        >
          <Route path="" element={<MessageFallBack />} />
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
        <Route path="/analysis" element={<AIResponse />} />

        {/* Other Protected Routes */}
        <Route
          path={ROUTES.SEARCH}
          element={
            <ProtectedRoutes>
              <SearchBox />
            </ProtectedRoutes>
          }
        />

        <Route
          path={ROUTES.READ}
          element={
            <ProtectedRoutes>
              <ReadList />
            </ProtectedRoutes>
          }
        />

        <Route path={ROUTES.SUGGESTIONS} element={<Suggestions />} />

        {/* Catch-all route */}
        <Route path="*" element={<PageError />} />
      </Route>
    </Routes>
  );
}

export default Router;
