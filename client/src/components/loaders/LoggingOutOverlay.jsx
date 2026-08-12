import React from "react";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";

function LoggingOutOverlay() {
  const { isLoggingOut } = useSelector((state) => state.auth);

  if (!isLoggingOut) return null;

  return (
    <div
      role="dialog"
      aria-label="Logging out overlay"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-xs w-full mx-4 ">
        <div className="relative flex items-center justify-center p-3 rounded-full ">
          <Spinner className="w-8 h-8 sm:w-10 sm:h-10 text-stone-900 dark:text-stone-100 p-0.5" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Logging Out...
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
            Cleaning up your session securely
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoggingOutOverlay;
