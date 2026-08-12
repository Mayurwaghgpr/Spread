import { useEffect, lazy, useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import PersistentUser from "./utils/components/PersistentUser";
import useSocket from "./hooks/useSocket";
import Router from "./router/Router";
import LoaderScreen from "./components/loaders/loaderScreen";
import ToastContainer from "./components/utilityComp/ToastContainer";
import ImageInBigFrame from "./components/utilityComp/ImageInBigFrame";
import NotificationBox from "./components/notification/NotificationBox";
import ConfirmationBox from "./components/utilityComp/ConfirmationBox";
import ConfimationActionListener from "./components/utilityComp/ConfimationActionListener";
import ShareToMediaBox from "./components/utilityComp/ShareToMediaBox";
import LoggingOutOverlay from "./components/loaders/LoggingOutOverlay";

const WelcomeLoginBox = lazy(
  () => import("./components/utilityComp/WelcomeLoginBox"),
);

function App() {
  const { pathname } = useLocation();
  const { isLogin, loginPop, user } = useSelector((state) => state.auth);
  const { ThemeMode } = useSelector((state) => state.ui);
  const { socket } = useSocket();

  // Unified theme management & persistence
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const activeMode = ThemeMode || localStorage.getItem("ThemeMode") || "system";
      const isDarkMode =
        activeMode === "dark" ||
        (activeMode === "system" && mediaQuery.matches);

      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      try {
        localStorage.setItem("ThemeMode", activeMode);
      } catch (e) {
        console.error("Error persisting ThemeMode:", e);
      }
    };

    applyTheme();

    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [ThemeMode]);

  // Handle socket registration
  useEffect(() => {
    if (socket && user?.id) {
      socket.emit("register", user.id);
    }
  }, [socket, user?.id]);

  return (
    <>
      <ToastContainer />
      <NotificationBox />
      <ConfirmationBox />
      <ImageInBigFrame />
      <ShareToMediaBox />
      <ConfimationActionListener />
      <LoggingOutOverlay />

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
