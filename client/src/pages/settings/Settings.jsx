import { memo, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function Settings() {
  const icons = useIcons();
  const navigate = useNavigate();
  const location = useLocation();

  const settingItems = useMemo(
    () => [
      { name: "General & Theme", iconKey: "sliders", stub: "", exact: true },
    ],
    []
  );

  const currentPath = location.pathname.replace(/^\/setting\/?/, "");

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-6 transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-label="Settings modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl h-[88vh] sm:h-[82vh] spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col sm:flex-row animate-in zoom-in-95 duration-150"
      >
        {/* Desktop Sidebar */}
        <aside className="hidden sm:flex flex-col w-64 border-r border-stone-200 dark:border-stone-800 p-5 bg-stone-100/60 dark:bg-stone-900/60 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-stone-200/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 text-lg">
                {icons.sliders}
              </div>
              <div>
                <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                  Settings
                </h1>
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  Preferences & controls
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {settingItems.map((setting) => {
                const isActive = setting.exact
                  ? currentPath === "" || currentPath === "/"
                  : currentPath.startsWith(setting.stub);

                return (
                  <Link
                    key={setting.name}
                    to={setting.stub}
                    replace={true}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-md"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100"
                    }`}
                  >
                    <span className="shrink-0 text-sm">{icons[setting.iconKey]}</span>
                    <span className="truncate">{setting.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-2 text-[11px] text-stone-400 font-medium border-t border-stone-200 dark:border-stone-800 pt-4">
            Spread Platform v1.2.0
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-stone-50/50 dark:bg-stone-950/50">
          {/* Header */}
          <header className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-900/30 shrink-0">
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-lg">{icons.sliders}</span>
              <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                Settings
              </h1>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                System Configurations
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close settings"
              className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-xl"
            >
              {icons.close}
            </button>
          </header>

          {/* Mobile Scrollable Navigation Bar */}
          <div className="sm:hidden flex overflow-x-auto p-2 border-b border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-900/40 gap-1 shrink-0 no-scrollbar">
            {settingItems.map((setting) => {
              const isActive = setting.exact
                ? currentPath === "" || currentPath === "/"
                : currentPath.startsWith(setting.stub);

              return (
                <Link
                  key={setting.name}
                  to={setting.stub}
                  replace={true}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                  }`}
                >
                  <span className="text-xs">{icons[setting.iconKey]}</span>
                  <span>{setting.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Outlet Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default memo(Settings);
