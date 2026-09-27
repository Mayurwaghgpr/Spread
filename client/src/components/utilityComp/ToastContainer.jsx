import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import ToastItem from "./ToastItem";
import { removeToast } from "../../store/slices/uiSlice";

function ToastContainer() {
  const { ToastState } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Allow global Escape to dismiss topmost active toast
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && ToastState?.length > 0) {
        const topToast = ToastState[ToastState.length - 1];
        if (topToast) {
          dispatch(removeToast(topToast.id));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ToastState, dispatch]);

  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("portal") || document.body
      : null;

  if (!portalRoot) return null;

  return createPortal(
    <aside
      aria-label="Notifications"
      role="region"
      className="fixed z-[100] pointer-events-none inset-x-0 bottom-20 sm:bottom-6 sm:inset-x-auto sm:right-6 flex flex-col items-center sm:items-end gap-2.5 px-3 sm:px-0 w-full sm:w-auto sm:max-w-[380px] max-w-full"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {ToastState?.map((content) => (
          <ToastItem
            key={content.id}
            ToastContent={content}
            onDismiss={(id) => dispatch(removeToast(id))}
          />
        ))}
      </AnimatePresence>
    </aside>,
    portalRoot
  );
}

export default memo(ToastContainer);
