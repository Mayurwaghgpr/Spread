import { memo } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";

function CookiePolicy() {
  const icons = useIcons();

  const cookieTypes = [
    {
      title: "Essential Authentication Cookies",
      badge: "Mandatory",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description:
        "Used solely to authenticate your logged-in session, safeguard against CSRF attacks, and verify API authorization tokens.",
    },
    {
      title: "Theme & UI Preference Storage",
      badge: "Functional",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description:
        "Stored in your browser's localStorage to persist your Dark / Light theme selection and interface layout scaling across refreshes.",
    },
    {
      title: "Analytics & Telemetry",
      badge: "None",
      badgeColor: "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700",
      description:
        "Spread does not use third-party behavioral advertising cookies or cross-site commercial trackers.",
    },
  ];

  return (
    <InfoPageLayout
      badge="Privacy & Security"
      badgeIcon={icons.shieldCheck}
      title="Cookie Policy"
      subtitle="Details on how cookies and browser storage are utilized across the Spread platform."
      lastUpdated="September 19, 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          What Are Cookies?
        </h2>
        <p>
          Cookies are small data files placed on your computer or mobile device when you visit websites. They are widely used to make web applications work efficiently and provide necessary security layers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Cookies & Storage Categories
        </h2>
        <div className="space-y-3">
          {cookieTypes.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                  {item.title}
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
          Managing Your Cookie Settings
        </h2>
        <p>
          You can modify your browser settings to reject cookies or clear existing session cookies. However, disabling essential authentication cookies will prevent you from signing in to Spread.
        </p>
      </section>
    </InfoPageLayout>
  );
}

export default memo(CookiePolicy);
