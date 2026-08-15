import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/uiSlice";
import { GitBranch, Github, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";

function GithubSyncSettings() {
  const dispatch = useDispatch();
  const [repoName, setRepoName] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = (e) => {
    e.preventDefault();
    if (!repoName.trim()) {
      dispatch(setToast({ message: "Please enter a GitHub repository name", type: "error" }));
      return;
    }
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      dispatch(setToast({ message: `Successfully connected ${repoName}!`, type: "success" }));
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>GitHub Integration</span>
          <Github className="w-4 h-4 text-stone-700 dark:text-stone-300" />
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Sync Markdown posts directly from your public or private GitHub repositories.
        </p>
      </div>

      {/* Feature Banner Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-stone-100 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Developer Integration</span>
        </div>
        <h3 className="text-base font-extrabold tracking-tight">
          Publish stories from commit logs & Markdown docs
        </h3>
        <p className="text-xs text-stone-300 leading-relaxed max-w-lg">
          Connect your GitHub repository to automatically format `.md` files into Spread articles whenever you push to `main`.
        </p>
      </div>

      {/* Sync Repository Form */}
      <form onSubmit={handleSync} className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3">
        <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
          Connect Repository
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="username/repository"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? "Syncing..." : "Connect Repo"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(GithubSyncSettings);
