import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import {
  setToast,
  updateToast,
  removeToast,
  removeAllToast,
} from "../store/slices/uiSlice";
import store from "../store/store";

/**
 * Normalizes input arguments so callers can pass:
 * 1) toast.success("Message", { duration: 3000, action: ... })
 * 2) toast.success({ message: "Message", title: "Success" })
 */
const normalizeToastArgs = (type, messageOrOptions, options = {}) => {
  if (typeof messageOrOptions === "object" && messageOrOptions !== null) {
    return {
      type,
      ...messageOrOptions,
      ...options,
    };
  }
  return {
    type,
    message: String(messageOrOptions || ""),
    ...options,
  };
};

/**
 * Standalone toast utility that can be called from anywhere
 * (inside hooks, callbacks, service interceptors, socket listeners, etc.)
 */
export const toast = {
  custom: (options) => {
    const id = options?.id || nanoid();
    store.dispatch(setToast({ id, ...options }));
    return id;
  },

  success: (messageOrOptions, options) => {
    const payload = normalizeToastArgs("success", messageOrOptions, options);
    const id = payload.id || nanoid();
    store.dispatch(setToast({ ...payload, id }));
    return id;
  },

  error: (messageOrOptions, options) => {
    const payload = normalizeToastArgs("error", messageOrOptions, options);
    const id = payload.id || nanoid();
    store.dispatch(setToast({ ...payload, id }));
    return id;
  },

  warning: (messageOrOptions, options) => {
    const payload = normalizeToastArgs("warning", messageOrOptions, options);
    const id = payload.id || nanoid();
    store.dispatch(setToast({ ...payload, id }));
    return id;
  },

  info: (messageOrOptions, options) => {
    const payload = normalizeToastArgs("info", messageOrOptions, options);
    const id = payload.id || nanoid();
    store.dispatch(setToast({ ...payload, id }));
    return id;
  },

  loading: (messageOrOptions, options) => {
    const payload = normalizeToastArgs("loading", messageOrOptions, options);
    const id = payload.id || nanoid();
    store.dispatch(
      setToast({
        duration: Infinity,
        ...payload,
        id,
      })
    );
    return id;
  },

  /**
   * Seamless async operation feedback:
   * toast.promise(asyncFn(), {
   *   loading: "Publishing article...",
   *   success: (data) => `Published!`,
   *   error: (err) => `Failed: ${err.message}`
   * })
   */
  promise: (promiseInstance, msgs = {}) => {
    const id = nanoid();
    const loadingMessage =
      typeof msgs.loading === "string"
        ? msgs.loading
        : msgs.loading?.message || "Working on it...";

    toast.loading(loadingMessage, { id, ...(msgs.loading || {}) });

    const p =
      typeof promiseInstance === "function" ? promiseInstance() : promiseInstance;

    return p
      .then((result) => {
        const successMsg =
          typeof msgs.success === "function"
            ? msgs.success(result)
            : typeof msgs.success === "string"
            ? msgs.success
            : msgs.success?.message || "Completed successfully!";

        const successOpts =
          typeof msgs.success === "object" && msgs.success !== null
            ? msgs.success
            : {};

        toast.success(successMsg, { id, ...successOpts });
        return result;
      })
      .catch((err) => {
        const errorMsg =
          typeof msgs.error === "function"
            ? msgs.error(err)
            : typeof msgs.error === "string"
            ? msgs.error
            : msgs.error?.message ||
              err?.response?.data?.message ||
              err?.message ||
              "An unexpected error occurred";

        const errorOpts =
          typeof msgs.error === "object" && msgs.error !== null
            ? msgs.error
            : {};

        toast.error(errorMsg, {
          id,
          details: err?.response?.data || err?.stack || err?.message,
          ...errorOpts,
        });
        throw err;
      });
  },

  update: (id, updates) => {
    store.dispatch(updateToast({ id, ...updates }));
  },

  dismiss: (id) => {
    store.dispatch(removeToast(id));
  },

  dismissAll: () => {
    store.dispatch(removeAllToast());
  },
};

/**
 * React hook version for components wanting scoped dispatch callbacks
 */
export function useToast() {
  const dispatch = useDispatch();

  const showToast = useCallback(
    (type, messageOrOptions, options) => {
      const payload = normalizeToastArgs(type, messageOrOptions, options);
      const id = payload.id || nanoid();
      dispatch(setToast({ ...payload, id }));
      return id;
    },
    [dispatch]
  );

  return {
    toast,
    success: useCallback(
      (msg, opts) => showToast("success", msg, opts),
      [showToast]
    ),
    error: useCallback(
      (msg, opts) => showToast("error", msg, opts),
      [showToast]
    ),
    warning: useCallback(
      (msg, opts) => showToast("warning", msg, opts),
      [showToast]
    ),
    info: useCallback(
      (msg, opts) => showToast("info", msg, opts),
      [showToast]
    ),
    loading: useCallback(
      (msg, opts) => showToast("loading", msg, { duration: Infinity, ...opts }),
      [showToast]
    ),
    promise: toast.promise,
    dismiss: useCallback((id) => dispatch(removeToast(id)), [dispatch]),
    dismissAll: useCallback(() => dispatch(removeAllToast()), [dispatch]),
  };
}

export default useToast;
