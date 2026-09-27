/* eslint-disable react/prop-types */
import { memo, forwardRef, useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import { removeToast } from "../../store/slices/uiSlice";
import useIcons from "../../hooks/useIcons";

const TYPE_CONFIG = {
  success: {
    badgeClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 shadow-xs",
    progressClass: "bg-emerald-500 dark:bg-emerald-400",
    accentGlow: "shadow-emerald-500/5 dark:shadow-emerald-500/10",
    borderHighlight: "dark:hover:border-emerald-800/40",
    ariaRole: "status",
    ariaLive: "polite",
  },
  error: {
    badgeClass:
      "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50 shadow-xs",
    progressClass: "bg-rose-500 dark:bg-rose-400",
    accentGlow: "shadow-rose-500/5 dark:shadow-rose-500/10",
    borderHighlight: "dark:hover:border-rose-800/40",
    ariaRole: "alert",
    ariaLive: "assertive",
  },
  warning: {
    badgeClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50 shadow-xs",
    progressClass: "bg-amber-500 dark:bg-amber-400",
    accentGlow: "shadow-amber-500/5 dark:shadow-amber-500/10",
    borderHighlight: "dark:hover:border-amber-800/40",
    ariaRole: "status",
    ariaLive: "polite",
  },
  info: {
    badgeClass:
      "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50 shadow-xs",
    progressClass: "bg-sky-500 dark:bg-sky-400",
    accentGlow: "shadow-sky-500/5 dark:shadow-sky-500/10",
    borderHighlight: "dark:hover:border-sky-800/40",
    ariaRole: "status",
    ariaLive: "polite",
  },
  loading: {
    badgeClass:
      "bg-stone-100 text-stone-600 dark:bg-stone-800/70 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/60 shadow-xs",
    progressClass: "bg-stone-400 dark:bg-stone-500",
    accentGlow: "shadow-black/5 dark:shadow-black/20",
    borderHighlight: "dark:hover:border-stone-700",
    ariaRole: "status",
    ariaLive: "polite",
  },
  default: {
    badgeClass:
      "bg-[#f7f4ee] text-stone-700 dark:bg-[#1c1c22] dark:text-stone-300 border border-[#e5dfd5] dark:border-[#2c2c34] shadow-xs",
    progressClass: "bg-stone-500 dark:bg-stone-400",
    accentGlow: "shadow-black/5 dark:shadow-black/20",
    borderHighlight: "dark:hover:border-stone-700",
    ariaRole: "status",
    ariaLive: "polite",
  },
};

const ToastItem = forwardRef(function ToastItem(
  { ToastContent, onDismiss },
  ref
) {
  const dispatch = useDispatch();
  const icons = useIcons();
  const prefersReducedMotion = useReducedMotion();

  const id = ToastContent.id;
  const type = ToastContent.type || "default";
  const duration = ToastContent.duration !== undefined ? ToastContent.duration : 4500;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;

  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);

  const isPausedRef = useRef(false);
  const remainingTimeRef = useRef(duration);

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(id);
    } else {
      dispatch(removeToast(id));
    }
  }, [dispatch, id, onDismiss]);

  // Handle countdown with pause/resume support
  useEffect(() => {
    if (duration === Infinity || duration <= 0) return;

    remainingTimeRef.current = duration;
    setProgressPercent(100);

    let lastTimestamp = performance.now();
    let frameId;

    const step = (now) => {
      const delta = now - lastTimestamp;
      lastTimestamp = now;

      if (!isPausedRef.current) {
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
        setProgressPercent((remainingTimeRef.current / duration) * 100);

        if (remainingTimeRef.current <= 0) {
          handleDismiss();
          return;
        }
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [duration, ToastContent.count, ToastContent.updatedAt, handleDismiss]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;
  };
  const handleTouchEnd = () => {
    isPausedRef.current = false;
  };

  const handleCopyDetails = async () => {
    try {
      const textToCopy =
        typeof ToastContent.details === "object"
          ? JSON.stringify(ToastContent.details, null, 2)
          : String(ToastContent.details || ToastContent.message);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy error details:", e);
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case "success":
        return icons.toastSuccess || icons.circleCheck || icons.success;
      case "error":
        return icons.toastError || icons.circleAlert || icons.error;
      case "warning":
        return icons.toastWarning || icons.warning;
      case "info":
        return icons.toastInfo || icons.infoCircle || icons.info;
      case "loading":
        return icons.toastLoading || icons.refresh;
      default:
        return icons[type] || icons.sparkles;
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 16, scale: 0.96 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 12, scale: 0.94, transition: { duration: 0.16 } }
      }
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
        mass: 0.8,
      }}
      drag="x"
      dragConstraints={{ left: -150, right: 150 }}
      dragElastic={0.4}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 250) {
          handleDismiss();
        }
      }}
      role={config.ariaRole}
      aria-live={config.ariaLive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          handleDismiss();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`group relative pointer-events-auto touch-pan-y flex flex-col w-full max-w-full sm:max-w-[380px] overflow-hidden rounded-2xl border border-[#e5dfd5]/90 dark:border-[#27272e]/90 bg-[#fffdfa]/95 dark:bg-[#121215]/95 text-stone-900 dark:text-stone-100 shadow-xl backdrop-blur-xl transition-colors duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-600 ${config.accentGlow} ${config.borderHighlight}`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3.5 p-3 sm:p-4">
        {/* Status Badge Icon */}
        <div
          className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base transition-transform duration-300 group-hover:scale-105 ${config.badgeClass}`}
        >
          {getStatusIcon()}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Title if provided */}
          {ToastContent.title && (
            <h4 className="text-xs font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-snug mb-0.5">
              {ToastContent.title}
            </h4>
          )}

          {/* Primary Message */}
          <div className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 font-normal break-words">
            {ToastContent.message}
          </div>

          {/* Secondary Description */}
          {ToastContent.description && (
            <p className="mt-1 text-[11px] leading-normal text-stone-500 dark:text-stone-400">
              {ToastContent.description}
            </p>
          )}

          {/* Expandable Technical Details (for errors / diagnostics) */}
          {ToastContent.details && (
            <div className="mt-2 text-[11px]">
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="inline-flex items-center gap-1 font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer focus:outline-none"
              >
                <span>{showDetails ? "Hide details" : "View technical details"}</span>
                <span className="text-xs">
                  {showDetails ? icons.toastChevronUp : icons.toastChevronDown}
                </span>
              </button>

              {showDetails && (
                <div className="mt-1.5 p-2 rounded-lg bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 font-mono text-[10px] leading-tight text-stone-700 dark:text-stone-300 overflow-x-auto max-h-28">
                  <div className="flex justify-between items-center mb-1 text-[9px] text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    <span>Trace / Payload</span>
                    <button
                      type="button"
                      onClick={handleCopyDetails}
                      className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-sans cursor-pointer focus:outline-none"
                    >
                      <span>{copied ? (icons.toastCheck || "Copied") : (icons.toastCopy || "Copy")}</span>
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-all">
                    {typeof ToastContent.details === "object"
                      ? JSON.stringify(ToastContent.details, null, 2)
                      : String(ToastContent.details)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons (e.g. Undo, Retry, View) */}
          {ToastContent.action && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof ToastContent.action?.onClick === "function") {
                    ToastContent.action.onClick(ToastContent);
                  }
                  if (ToastContent.action?.dismissOnClick !== false) {
                    handleDismiss();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-xs active:scale-95 transition-all cursor-pointer focus-ring"
              >
                {ToastContent.action.icon && <span>{ToastContent.action.icon}</span>}
                <span>{ToastContent.action.label || "Action"}</span>
              </button>

              {ToastContent.cancel && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof ToastContent.cancel?.onClick === "function") {
                      ToastContent.cancel.onClick();
                    }
                    handleDismiss();
                  }}
                  className="px-2 py-1 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
                >
                  {ToastContent.cancel.label || "Dismiss"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Corner: Duplicate Badge + Dismiss Button */}
        <div className="shrink-0 flex items-center gap-1.5 -mr-1">
          {/* Duplicate Counter Pill */}
          {ToastContent.count > 1 && (
            <motion.span
              key={ToastContent.count}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 shadow-2xs"
              title={`Occurred ${ToastContent.count} times`}
            >
              ×{ToastContent.count}
            </motion.span>
          )}

          {/* Dismiss (Close) Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/70 transition-colors focus:outline-none focus-ring cursor-pointer"
          >
            <span className="text-base flex items-center justify-center">
              {icons.toastClose || icons.close}
            </span>
          </button>
        </div>
      </div>

      {/* Hairline Lifetime / Progress Bar */}
      {duration !== Infinity && duration > 0 && (
        <div className="w-full h-[2px] bg-stone-200/50 dark:bg-stone-800/60 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${config.progressClass}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </motion.div>
  );
});

export default memo(ToastItem);
