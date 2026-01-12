import React from "react";
import { BiHome } from "react-icons/bi";
import { LuRefreshCw } from "react-icons/lu";
import { TbAlertTriangle } from "react-icons/tb";

function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg border border-red-100 p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <TbAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We encountered an unexpected error. Don't worry, this happens
            sometimes. You can try refreshing the page or going back to the
            homepage.
          </p>
        </div>

        {/* Error Details (Development Mode) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border text-left">
            <p className="text-xs font-mono text-gray-700 break-all">
              {error.message || "Unknown error occurred"}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 text-nowrap">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 flex items-center justify-center gap-2 text-red-400 hover:text-red-600  px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LuRefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={handleReload}
            className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600  px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <LuRefreshCw className="w-4 h-4" />
            Reload Page
          </button>

          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600  px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <BiHome className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundaryFallback;
