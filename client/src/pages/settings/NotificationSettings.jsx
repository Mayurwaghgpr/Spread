import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

function NotificationSettings() {
  const icons = useIcons();
  const dispatch = useDispatch();
  const [preferences, setPreferences] = useState({
    push: true,
    email: false,
    messages: true,
    sound: true,
  });

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

  const notificationOptions = [
    {
      key: "push",
      icon: icons.bellO,
      title: "Push Notifications",
      description: "Receive instant notifications for likes, comments, and mentions.",
    },
    {
      key: "messages",
      icon: icons.message,
      title: "Direct Messages",
      description: "Alerts when you receive direct messages or group chats.",
    },
    {
      key: "email",
      icon: icons.email,
      title: "Email Digests",
      description: "Weekly summary of trending stories and account activity.",
    },
    {
      key: "sound",
      icon: icons.volume,
      title: "Sound Effects",
      description: "Play subtle audio cues for reactions and messages.",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>Notifications & Preferences</span>
          <span className="text-sm">{icons.appreciate}</span>
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Control how and when you receive updates from Spread.
        </p>
      </div>

      <div className="space-y-3">
        {notificationOptions.map((opt) => {
          const isChecked = preferences[opt.key];

          return (
            <div
              key={opt.key}
              onClick={() => togglePreference(opt.key, opt.title)}
              className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 shrink-0 text-sm">
                  {opt.icon}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {opt.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-normal">
                    {opt.description}
                  </p>
                </div>
              </div>

              {/* Custom Switch Component */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
                  isChecked ? "bg-stone-900 dark:bg-stone-100" : "bg-stone-300 dark:bg-stone-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow-md ring-0 transition duration-200 ease-in-out ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(NotificationSettings);
