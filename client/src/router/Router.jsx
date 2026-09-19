import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useSelector } from "react-redux";
import ProtectedRoutes from "../utils/components/ProtectedRoutes";
import LoaderScreen from "../components/loaders/loaderScreen";
import GroupBoard from "../pages/savedPosts/GroupBoard";
// Lazy load components with better error boundaries
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const ForgotPass = lazy(() => import("../pages/auth/ForgotPass"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Home = lazy(() => import("../pages/home/Home"));
const PageError = lazy(() => import("../pages/ErrorPages/ErrorPage"));
const Profile = lazy(() => import("../pages/userProfile/Profile"));
const Heroes = lazy(() => import("../pages/Landing/Heroes"));
const DynamicPostEditor = lazy(
  () => import("../pages/PostEditor/DynamicPostEditor"),
);
const PostPreviewEditor = lazy(
  () => import("../pages/PostEditor/components/PostPreviewEditor"),
);
const PostView = lazy(() => import("../pages/PostView/PostView"));
const ProfileEditor = lazy(() => import("../pages/userProfile/ProfileEditor"));
const About = lazy(() => import("../pages/About"));
const ReadList = lazy(() => import("../pages/savedPosts/ReadList"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const General = lazy(() => import("../pages/settings/General"));
const AccountSettings = lazy(() => import("../pages/settings/AccountSettings"));
const NotificationSettings = lazy(() => import("../pages/settings/NotificationSettings"));
const GithubSyncSettings = lazy(() => import("../pages/settings/GithubSyncSettings"));
const SecuritySettings = lazy(() => import("../pages/settings/SecuritySettings"));
const Conversations = lazy(() => import("../pages/Conversation/Conversations"));
const ConversationSection = lazy(
  () => import("../pages/Conversation/ConversationSection"),
);
const SearchBox = lazy(() => import("../pages/Search&Explorer/SearchBox"));
const CommentSection = lazy(() => import("../pages/Comment/CommentSection"));

const Suggestions = lazy(() => import("../pages/home/Suggestions"));
const ConversationInfo = lazy(
  () => import("../pages/Conversation/ConversationInfo"),
);
const InfoSection = lazy(
  () => import("../pages/Conversation/components/InfoSection"),
);
const SomethingWentWrong = lazy(
  () => import("../components/errors/SomethingWentWrong"),
);
const NewConversation = lazy(
  () => import("../pages/Conversation/NewConversation"),
);
const AIResponse = lazy(() => import("../components/aiComp/AiResponse"));
const ConversationFallBack = lazy(
  () => import("../pages/Conversation/components/ConversationFallBack"),
);
const PrivacyPolicy = lazy(() => import("../pages/static/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/static/TermsOfService"));
const CookiePolicy = lazy(() => import("../pages/static/CookiePolicy"));
const HelpCenter = lazy(() => import("../pages/static/HelpCenter"));
const ContactUs = lazy(() => import("../pages/static/ContactUs"));
const Creators = lazy(() => import("../pages/static/Creators"));
const Showcase = lazy(() => import("../pages/static/Showcase"));
const CommunityEvents = lazy(() => import("../pages/static/CommunityEvents"));
const Blog = lazy(() => import("../pages/static/Blog"));
const Features = lazy(() => import("../pages/static/Features"));

const ROUTES = {
  HOME: "/",
  HEROES: "/heroes",
  PROFILE: "/profile/:username/:profileId",
  PROFILE_EDITOR: "/profileEditor",
  WRITE: "/write",
  SETTINGS: "/setting",
  MESSAGES: "/messages",
  POST_VIEW: "/view/:username/:id",
  SEARCH: "/search",
  SUGGESTIONS: "/suggestions/find_peoples",
  SAVED: { main: "/saved", read: "read/:group" },
  AUTH_SIGNIN: "/auth/signin",
  AUTH_SIGNUP: "/auth/signup",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  COOKIES: "/cookies",
  HELP: "/help",
  CONTACT: "/contact",
  CREATORS: "/creators",
  SHOWCASE: "/showcase",
  EVENTS: "/events",
  BLOG: "/blog",
  FEATURES: "/features",
  FORGOT_PASS: "/forgot/pass",
  RESET_PASS: "/reset/pass/:token",
  ERROR: "/error",
};
function Router() {
  const { isLogin } = useSelector((state) => state.auth);
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

      {/* Public Informational & Static Pages */}
      <Route
        path={ROUTES.ABOUT}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <About />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.PRIVACY}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <PrivacyPolicy />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.TERMS}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <TermsOfService />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.COOKIES}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <CookiePolicy />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.HELP}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <HelpCenter />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.CONTACT}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <ContactUs />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.CREATORS}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <Creators />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.SHOWCASE}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <Showcase />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.EVENTS}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <CommunityEvents />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.BLOG}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <Blog />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.FEATURES}
        element={
          <Suspense fallback={<LoaderScreen />}>
            <Features />
          </Suspense>
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
            path="account"
            element={
              <ProtectedRoutes>
                <AccountSettings />
              </ProtectedRoutes>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoutes>
                <NotificationSettings />
              </ProtectedRoutes>
            }
          />
          <Route
            path="github/sync"
            element={
              <ProtectedRoutes>
                <GithubSyncSettings />
              </ProtectedRoutes>
            }
          />
          <Route
            path="security"
            element={
              <ProtectedRoutes>
                <SecuritySettings />
              </ProtectedRoutes>
            }
          />
        </Route>

        {/* Messages Routes */}
        <Route
          path={ROUTES.MESSAGES}
          element={
            <ProtectedRoutes>
              <Conversations />
            </ProtectedRoutes>
          }
        >
          <Route path="" element={<ConversationFallBack />} />
          <Route path="new/c" element={<NewConversation />} />
          <Route path="c" element={<ConversationSection />}>
            <Route path="info" element={<ConversationInfo />}>
              <Route index element={<InfoSection />} />
            </Route>
          </Route>
        </Route>

        {/* Post View Routes */}
        <Route path={ROUTES.POST_VIEW} element={<PostView />}>
          <Route path="comments" element={<CommentSection />} />
        </Route>
        <Route path="/post/:id" element={<PostView />}>
          <Route path="comments" element={<CommentSection />} />
        </Route>
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/analysis" element={<AIResponse />} />

        {/* Search & Explore Route */}
        <Route
          path={ROUTES.SEARCH}
          element={<SearchBox />}
        />

        <Route path={ROUTES.SAVED.main}>
          <Route
            path={""}
            element={
              <ProtectedRoutes>
                <GroupBoard />
              </ProtectedRoutes>
            }
          />
          <Route
            path={ROUTES.SAVED.read}
            element={
              <ProtectedRoutes>
                <ReadList />
              </ProtectedRoutes>
            }
          />
        </Route>

        <Route path={ROUTES.SUGGESTIONS} element={<Suggestions />} />
      </Route>
      {/* Catch-all route */}
      <Route path="*" element={<PageError />} />
    </Routes>
  );
}

export default Router;
