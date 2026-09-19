import { memo } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/uiSlice";
import LogoutBtn from "../../components/buttons/LogoutBtn";
import useIcons from "../../hooks/useIcons";

function SecuritySettings() {
  const icons = useIcons();
  const dispatch = useDispatch();

  const handleClearCache = () => {
    try {
      sessionStorage.clear();
      dispatch(setToast({ message: "App cache cleared successfully!", type: "success" }));
    } catch (e) {
      dispatch(setToast({ message: "Failed to clear cache", type: "error" }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>Security & Sessions</span>
          <span className="text-emerald-500 text-base">{icons.shieldCheck}</span>
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Manage device sessions, authentication, and local data storage.
        </p>
      </div>

      {/* Active Session Info */}
      <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3">
        <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          Active Device
        </span>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 text-sm">
              {icons.desktopO}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Mac OS Web Session
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Active now • Current Workspace
              </p>
            </div>
          </div>

          <span className="spread-pill text-[10px] px-2.5 py-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
            Active Now
          </span>
        </div>
      </div>

      {/* Storage & Clear Cache Utility */}
      <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 text-sm">
            {icons.delete}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              Clear App Cache
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Free up browser memory and refresh local cached states.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearCache}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors cursor-pointer text-stone-800 dark:text-stone-200 shrink-0"
        >
          Clear Cache
        </button>
      </div>

      {/* Account Sign Out Action */}
      <div className="pt-2">
        <LogoutBtn />
      </div>
    </div>
  );
}

export default memo(SecuritySettings);
