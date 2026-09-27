import React from "react";
import useIcons from "../../hooks/useIcons";

function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  const icons = useIcons();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="max-w-lg w-full spread-card rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 text-center shadow-xl">
        {/* Error Icon */}
        <div className="mb-5 flex justify-center">
          <div className="w-16 h-16 bg-amber-100/80 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-3xl">
            {icons.alertTriangle}
          </div>
        </div>

        {/* Error Heading & Description */}
        <div className="mb-6 space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
            We ran into an unexpected issue while rendering this page. You can try recovering below or returning to the homepage.
          </p>
        </div>

        {/* Error Details (Development Mode) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-3 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 text-left overflow-x-auto">
            <p className="text-[11px] font-mono text-red-600 dark:text-red-400 break-all">
              {error.message || "Unknown runtime exception"}
            </p>
          </div>
        )}

        {/* Action Buttons following Jakob's Law */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="spread-btn-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">{icons.refresh}</span>
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="spread-btn-secondary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-transform active:scale-95 cursor-pointer text-stone-700 dark:text-stone-300"
          >
            <span className="w-4 h-4 flex items-center justify-center">{icons.refresh}</span>
            <span>Reload Page</span>
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="spread-btn-secondary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-transform active:scale-95 cursor-pointer text-stone-700 dark:text-stone-300"
          >
            <span className="w-4 h-4 flex items-center justify-center">{icons.homeO}</span>
            <span>Go Home</span>
          </button>
        </div>

        {/* Support Help Text */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            If this issue persists, please refresh your browser or check your connection.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundaryFallback;
