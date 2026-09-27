import { useEffect, lazy, useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import PersistentUser from "./utils/components/PersistentUser";
import ChatApi from "./services/ChatApi";
import { getOrCreateEncryptionIdentity } from "./utils/e2ee";
import Router from "./router/Router";
import LoaderScreen from "./components/loaders/loaderScreen";
import ToastContainer from "./components/utilityComp/ToastContainer";
import ImageInBigFrame from "./components/utilityComp/ImageInBigFrame";
import NotificationBox from "./components/notification/NotificationBox";
import ConfirmationBox from "./components/utilityComp/ConfirmationBox";
import ConfimationActionListener from "./components/utilityComp/ConfimationActionListener";
import ShareToMediaBox from "./components/utilityComp/ShareToMediaBox";
import LoggingOutOverlay from "./components/loaders/LoggingOutOverlay";

import { useChatNotifications } from "./hooks/useChatNotifications";

const WelcomeLoginBox = lazy(
  () => import("./components/utilityComp/WelcomeLoginBox"),
);

function App() {
  const { pathname } = useLocation();
  const { isLogin, loginPop, user } = useSelector((state) => state.auth);
  const { ThemeMode } = useSelector((state) => state.ui);
  const { publishEncryptionIdentity } = ChatApi();

  // Global Real-time Chat Notification listener (suppression, toasts, sound & title badge)
  useChatNotifications();

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

  // Publish only the public half of the device-bound E2EE identity. The
  // private CryptoKey remains non-extractable in IndexedDB on this browser.
  useEffect(() => {
    if (!isLogin || !user?.id) return;
    let cancelled = false;
    getOrCreateEncryptionIdentity()
      .then(({ publicKey }) => publishEncryptionIdentity(publicKey))
      .catch((error) => {
        const status = error?.response?.status || error?.status;
        if (status === 409) {
          // Account already has an encryption identity established
          return;
        }
        if (!cancelled) console.error("Unable to initialize secure messaging", error);
      });
    return () => {
      cancelled = true;
    };
  }, [isLogin, user?.id]);

  // Ensure Service Worker is active for background Web Push notifications
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
        console.warn("Service worker registration error:", err);
      });
    }
  }, []);

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
