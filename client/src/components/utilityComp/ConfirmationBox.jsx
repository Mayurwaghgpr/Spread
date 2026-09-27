import { useDispatch, useSelector } from "react-redux";
import { setConfirmBox } from "../../store/slices/uiSlice";
import { createPortal } from "react-dom";
import { useCallback, useEffect } from "react";
import Spinner from "../../components/loaders/Spinner";
import useIcons from "../../hooks/useIcons";

function ConfirmationBox() {
  const { confirmBox } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const icons = useIcons();

  const handleCancel = useCallback(() => {
    dispatch(setConfirmBox({ message: "", status: false }));
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    if (!confirmBox.status) return;
    dispatch(setConfirmBox({ ...confirmBox, isConfirm: true }));
  }, [confirmBox, dispatch]);

  // Global Escape key listener following Jakob's Law for dialogs
  useEffect(() => {
    if (!confirmBox.status) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmBox.status, handleCancel]);

  if (!confirmBox.status) return null;

  const isDestructive =
    confirmBox.type?.toLowerCase().includes("del") ||
    confirmBox.title?.toLowerCase().includes("del");

  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("portal") || document.body
      : null;

  if (!portalRoot) return null;

  return createPortal(
    <div
      onClick={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-md bg-[#fffdfa] dark:bg-[#121215] border border-[#e5dfd5] dark:border-[#232328] rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Top Header Row with Icon & Close */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
              isDestructive
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40"
                : "bg-stone-100 text-stone-700 dark:bg-stone-800/80 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
            }`}
          >
            {isDestructive ? icons.toastError || icons.trash : icons.circleAlert || icons.info}
          </div>

          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <span className="text-base flex items-center justify-center">
              {icons.close}
            </span>
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-1.5 mb-6">
          <h2
            id="confirm-dialog-title"
            className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight"
          >
            {confirmBox.title || "Confirm Action"}
          </h2>
          <p
            id="confirm-dialog-desc"
            className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-400 break-words"
          >
            {confirmBox?.message}
          </p>
        </div>

        {/* Action Buttons: Cancel vs Destructive/Confirm */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#e5dfd5]/60 dark:border-[#232328]/60">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] border border-transparent hover:border-[#e5dfd5] dark:hover:border-[#232328] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmBox.isConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-500"
                : "spread-btn-primary"
            } ${confirmBox.isConfirm ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {confirmBox.isConfirm ? (
              <>
                <Spinner className="w-3.5 h-3.5 text-current" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmBox?.type || "Confirm"}</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
}

export default ConfirmationBox;
