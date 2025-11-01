import { useEffect, lazy, useState, useMemo, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import PersistentUser from "./utils/PersistentUser";
import useSocket from "./hooks/useSocket";
import Router from "./router/Router";
import LoaderScreen from "./component/loaders/loaderScreen";
import ToastContainer from "./component/utilityComp/ToastContainer";
import ConfirmationBox from "./component/utilityComp/ConfirmationBox";
import ImageInBigFrame from "./component/utilityComp/ImageInBigFrame";
import NotificationBox from "./component/notification/NotificationBox";
// Lazy load components with better error boundaries

const WelcomeLoginBox = lazy(
  () => import("./component/utilityComp/WelcomeLoginBox")
);
// Constants for better maintainability
const THEME_STORAGE_KEY = "ThemeMode";

function App() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
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
      <ToastContainer />
      <NotificationBox />
      <ConfirmationBox />
      <ImageInBigFrame />

      <PersistentUser />
      {loginPop && (
        <Suspense fallback={<LoaderScreen />}>
          <WelcomeLoginBox />
        </Suspense>
      )}
      <Router />
    </>
  );
}

export default App;
