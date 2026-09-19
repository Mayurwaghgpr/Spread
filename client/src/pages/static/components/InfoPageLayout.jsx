import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useIcons from "../../../hooks/useIcons";
import ThemeBtn from "../../../components/buttons/ThemeBtn";
import Footer from "../../../components/footer/Footer";

function InfoPageLayout({
  badge,
  badgeIcon,
  title,
  subtitle,
  lastUpdated,
  children,
}) {
  const icons = useIcons();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.auth);

  const Modes = [
    { name: "Dark mode", value: "dark", icon: "moonFi" },
    { name: "Light mode", value: "light", icon: "sun" },
    { name: "System", value: "system", icon: "desktopO" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fffdfa] dark:bg-[#09090b] text-stone-900 dark:text-stone-100 selection:bg-stone-900 selection:text-stone-100 dark:selection:bg-stone-100 dark:selection:text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 flex justify-between items-center bg-[#fffdfa]/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-1.5 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-lg"
          >
            {icons.arrowL}
          </button>
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-all duration-200"
          >
            <img
              src="/spread_logo_03_robopus.png"
              alt="Spread Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
              Spread
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeBtn
            className="text-base sm:text-lg rounded-full p-2 bg-stone-200/60 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 shadow-sm hover:scale-105 transition-transform"
            Modes={Modes}
          />
          {isLogin ? (
            <Link
              to="/"
              className="spread-btn-primary text-xs px-4 py-1.5 rounded-full font-bold"
            >
              Feed
            </Link>
          ) : (
            <Link
              to="/auth/signin"
              className="spread-btn-primary text-xs px-4 py-1.5 rounded-full font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {/* Page Hero Header */}
        <div className="mb-10 sm:mb-14 space-y-4">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-stone-200/70 dark:bg-stone-800/70 text-stone-800 dark:text-stone-200 border border-stone-300/60 dark:border-stone-700/60">
              {badgeIcon && <span className="text-xs">{badgeIcon}</span>}
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          {lastUpdated && (
            <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 pt-2">
              Last updated: {lastUpdated}
            </p>
          )}

          <div className="w-full h-px bg-stone-200 dark:border-stone-800 dark:bg-stone-800 mt-6" />
        </div>

        {/* Dynamic Page Body */}
        <div className="max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed space-y-8">
          {children}
        </div>
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}

export default memo(InfoPageLayout);
