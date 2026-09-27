import { memo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";
import { usePushNotification } from "../../hooks/usePushNotification";
import Spinner from "../../components/loaders/Spinner";

function NotificationSettings() {
  const icons = useIcons();
  const dispatch = useDispatch();

  // Real Web Push Notification integration
  const {
    isSupported,
    permission,
    isSubscribed,
    subscriptionMode,
    isBrave,
    isIOS,
    isStandalone,
    pushServiceBlocked,
    isLoading: isPushLoading,
    isTestingPush,
    togglePush,
    triggerTestPush,
  } = usePushNotification();

  // Local storage persisted preferences for non-push toggles
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("spread_notification_prefs");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      email: false,
      messages: true,
      sound: true,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("spread_notification_prefs", JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  const togglePreference = (key, label) => {
    setPreferences((prev) => {
      const nextVal = !prev[key];
      dispatch(
        setToast({
          message: `${label} ${nextVal ? "enabled" : "disabled"}`,
          type: "success",
        })
      );
      return { ...prev, [key]: nextVal };
    });
  };

  const isPermissionBlocked = permission === "denied";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>Notifications & Preferences</span>
          <span className="text-sm">{icons.appreciate}</span>
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Control how and when you receive real-time and background updates from Spread.
        </p>
      </div>

      <div className="space-y-3">
        {/* 1. Real Web Push Notifications Card */}
        <div
          className={`p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border transition-all ${
            isPermissionBlocked
              ? "border-amber-300 dark:border-amber-700/50"
              : "border-stone-200 dark:border-stone-800"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 shrink-0 text-sm">
                {icons.bellO}
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    Push Notifications
                  </h3>
                  {isSubscribed && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        subscriptionMode === "push"
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-sky-600 dark:text-sky-400 bg-sky-500/10"
                      }`}
                    >
                      {subscriptionMode === "push" ? "Active (All Devices)" : "Active (In-Browser)"}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-normal">
                  Receive native OS alerts for claps, comments, follows, and messages across all devices and browsers.
                </p>
              </div>
            </div>

            {/* Push Switch Component */}
            <div className="flex items-center gap-2 shrink-0">
              {isPushLoading && <Spinner className="w-4 h-4 text-stone-600 dark:text-stone-400" />}
              <button
                type="button"
                role="switch"
                disabled={isPushLoading || isPermissionBlocked || !isSupported}
                aria-checked={isSubscribed}
                onClick={togglePush}
                title={
                  isPermissionBlocked
                    ? "Notifications blocked in browser settings"
                    : isSubscribed
                    ? "Turn off push notifications"
                    : "Turn on push notifications"
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
                  isSubscribed
                    ? "bg-stone-900 dark:bg-stone-100"
                    : "bg-stone-300 dark:bg-stone-700"
                } ${isPermissionBlocked || !isSupported ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow-md ring-0 transition duration-200 ease-in-out ${
                    isSubscribed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Blocked in Browser Feedback (Jakob's Law UX) */}
          {isPermissionBlocked && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <span className="text-amber-600 dark:text-amber-400 text-sm mt-0.5 shrink-0">
                {icons.lock}
              </span>
              <div className="space-y-1">
                <p className="font-bold">Notifications are blocked in your browser</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  To enable push notifications on this device, click the tune/padlock icon next to the URL in your browser address bar and set <strong>Notifications</strong> to <strong>Allow</strong>.
                </p>
              </div>
            </div>
          )}

          {/* iOS Safari Home Screen PWA Guidance */}
          {isIOS && !isStandalone && (
            <div className="mt-3 p-3.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-300/80 dark:border-sky-700/60 text-xs text-sky-950 dark:text-sky-200 flex items-start gap-3">
              <span className="text-sky-600 dark:text-sky-400 text-base mt-0.5 shrink-0">
                {icons.desktopMobile || "📱"}
              </span>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="font-bold text-stone-900 dark:text-stone-100">
                  Apple iOS Push Notification Setup
                </p>
                <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                  Apple requires Spread to be added to your Home Screen to enable native Web Push on iPhone and iPad:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-700 dark:text-stone-300 pl-1 font-medium">
                  <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                  <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                  <li>Open Spread from your Home Screen to activate notifications.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Brave Browser Privacy Configuration Guidance */}
          {(pushServiceBlocked || (isBrave && subscriptionMode !== "push" && !isPermissionBlocked)) && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/80 dark:border-amber-700/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3 animate-in fade-in duration-200">
              <span className="text-amber-600 dark:text-amber-400 text-base mt-0.5 shrink-0">
                {icons.lock}
              </span>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-stone-900 dark:text-stone-100">
                    Enable Background Push when Brave is Closed
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                    Brave Privacy
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                  {isSubscribed
                    ? "In-browser notifications are active while Brave is running! To also receive notifications when Brave is completely closed:"
                    : "By default, Brave disables Google push messaging services for privacy. To receive notifications when Brave is completely closed:"}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-700 dark:text-stone-300 pl-1 font-medium">
                  <li>
                    Open a new tab and paste:{" "}
                    <code className="px-1.5 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/60 font-mono text-[10px] text-amber-900 dark:text-amber-200 select-all">
                      brave://settings/privacy
                    </code>
                  </li>
                  <li>
                    Turn <strong>ON</strong>: <em>&ldquo;Use Google services for push messaging&rdquo;</em>
                  </li>
                  <li>Relaunch Brave and return here.</li>
                </ol>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("brave://settings/privacy");
                      dispatch(
                        setToast({
                          message: "Copied brave://settings/privacy to clipboard!",
                          type: "success",
                        })
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-200 hover:bg-amber-300 dark:bg-amber-900/60 dark:hover:bg-amber-850/80 text-amber-950 dark:text-amber-100 transition-colors cursor-pointer active:scale-95"
                  >
                    <span>{icons.toastCopy || "Copy"}</span>
                    <span>Copy brave://settings/privacy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Push Button & OS Background Guidance when active */}
          {isSubscribed && (
            <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Verify native notifications on your system:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerTestPush({ delay: 0 })}
                    disabled={isTestingPush}
                    className="spread-btn-secondary text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                    title="Send immediate test notification"
                  >
                    {isTestingPush ? (
                      <Spinner className="w-3 h-3" />
                    ) : (
                      <span className="w-3 h-3 flex items-center justify-center">{icons.sendFi}</span>
                    )}
                    <span>Test Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerTestPush({ delay: 5 })}
                    disabled={isTestingPush}
                    className="bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                    title="Send test alert in 5 seconds so you can close or minimize this tab to test"
                  >
                    {isTestingPush ? (
                      <Spinner className="w-3 h-3 text-stone-400" />
                    ) : (
                      <span className="w-3 h-3 flex items-center justify-center">{icons.clock || icons.refresh}</span>
                    )}
                    <span>Test in 5s (Close Tab)</span>
                  </button>
                </div>
              </div>

              {/* OS Guidance Hint */}
              <div className="p-2.5 rounded-xl bg-stone-200/40 dark:bg-stone-800/30 text-[10px] text-stone-600 dark:text-stone-400 space-y-1">
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  💡 How background notifications work:
                </p>
                <p>
                  1. <strong>System Settings:</strong> Ensure your OS allows alerts for your browser (e.g. <em>System Settings &gt; Notifications &gt; Google Chrome</em>).
                </p>
                <p>
                  2. <strong>Browser Lifecycle:</strong> Notifications are received even when all Spread tabs are closed, as long as your browser remains running in the background. On macOS, completely quitting the browser (<em>Cmd + Q</em>) terminates background processes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Direct Messages Alerts */}
        <div
          onClick={() => togglePreference("messages", "Direct message alerts")}
          className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 shrink-0 text-sm">
              {icons.message}
            </div>
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Direct Messages
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-normal">
                Alerts when you receive direct messages or group chats.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={preferences.messages}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
              preferences.messages ? "bg-stone-900 dark:bg-stone-100" : "bg-stone-300 dark:bg-stone-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow-md ring-0 transition duration-200 ease-in-out ${
                preferences.messages ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 3. Email Digests */}
        <div
          onClick={() => togglePreference("email", "Email digests")}
          className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 shrink-0 text-sm">
              {icons.email}
            </div>
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Email Digests
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-normal">
                Weekly summary of trending stories and account activity.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={preferences.email}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
              preferences.email ? "bg-stone-900 dark:bg-stone-100" : "bg-stone-300 dark:bg-stone-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow-md ring-0 transition duration-200 ease-in-out ${
                preferences.email ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 4. Sound Effects */}
        <div
          onClick={() => togglePreference("sound", "Sound effects")}
          className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 shrink-0 text-sm">
              {icons.volume}
            </div>
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Sound Effects
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-normal">
                Play subtle audio cues for reactions and messages.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={preferences.sound}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
              preferences.sound ? "bg-stone-900 dark:bg-stone-100" : "bg-stone-300 dark:bg-stone-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow-md ring-0 transition duration-200 ease-in-out ${
                preferences.sound ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(NotificationSettings);

