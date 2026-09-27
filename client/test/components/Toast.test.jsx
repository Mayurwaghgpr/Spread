import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import uiReducer, {
  setToast,
  updateToast,
  removeToast,
  removeAllToast,
} from "../../src/store/slices/uiSlice";
import ToastItem from "../../src/components/utilityComp/ToastItem";
import { toast } from "../../src/hooks/useToast";
import store from "../../src/store/store";

describe("Toast System", () => {
  describe("uiSlice Reducers", () => {
    let testStore;

    beforeEach(() => {
      testStore = configureStore({
        reducer: {
          ui: uiReducer,
        },
      });
    });

    it("should add a new toast with unique ID and default count", () => {
      testStore.dispatch(
        setToast({ message: "Post published!", type: "success" })
      );
      const state = testStore.getState().ui;
      expect(state.ToastState).toHaveLength(1);
      expect(state.ToastState[0].message).toBe("Post published!");
      expect(state.ToastState[0].type).toBe("success");
      expect(state.ToastState[0].count).toBe(1);
      expect(state.ToastState[0].id).toBeDefined();
    });

    it("should increment count for duplicate toast with identical message and type", () => {
      testStore.dispatch(
        setToast({ message: "Link copied", type: "success" })
      );
      testStore.dispatch(
        setToast({ message: "Link copied", type: "success" })
      );
      const state = testStore.getState().ui;
      expect(state.ToastState).toHaveLength(1);
      expect(state.ToastState[0].count).toBe(2);
    });

    it("should allow distinct toasts with same type but different messages", () => {
      testStore.dispatch(
        setToast({ message: "First message", type: "success" })
      );
      testStore.dispatch(
        setToast({ message: "Second message", type: "success" })
      );
      const state = testStore.getState().ui;
      expect(state.ToastState).toHaveLength(2);
      expect(state.ToastState[0].message).toBe("First message");
      expect(state.ToastState[1].message).toBe("Second message");
    });

    it("should seamlessly morph toast in-place when matching ID is provided", () => {
      const fixedId = "async-job-1";
      testStore.dispatch(
        setToast({ id: fixedId, message: "Uploading story...", type: "loading" })
      );
      expect(testStore.getState().ui.ToastState[0].type).toBe("loading");

      // Morph to success
      testStore.dispatch(
        setToast({ id: fixedId, message: "Story published!", type: "success" })
      );
      const state = testStore.getState().ui;
      expect(state.ToastState).toHaveLength(1);
      expect(state.ToastState[0].id).toBe(fixedId);
      expect(state.ToastState[0].type).toBe("success");
      expect(state.ToastState[0].message).toBe("Story published!");
    });

    it("should update toast via updateToast", () => {
      const toastId = "test-update-id";
      testStore.dispatch(
        setToast({ id: toastId, message: "Initial message", type: "info" })
      );
      testStore.dispatch(
        updateToast({ id: toastId, message: "Updated message" })
      );
      expect(testStore.getState().ui.ToastState[0].message).toBe("Updated message");
    });

    it("should remove a specific toast by id", () => {
      testStore.dispatch(
        setToast({ id: "t1", message: "Toast 1", type: "info" })
      );
      testStore.dispatch(
        setToast({ id: "t2", message: "Toast 2", type: "info" })
      );
      expect(testStore.getState().ui.ToastState).toHaveLength(2);

      testStore.dispatch(removeToast("t1"));
      const state = testStore.getState().ui;
      expect(state.ToastState).toHaveLength(1);
      expect(state.ToastState[0].id).toBe("t2");
    });

    it("should remove all toasts without resetting unrelated UI state", () => {
      testStore.dispatch(
        setToast({ message: "Toast 1", type: "info" })
      );
      testStore.dispatch(removeAllToast());
      expect(testStore.getState().ui.ToastState).toHaveLength(0);
    });
  });

  describe("ToastItem UI Component", () => {
    let mockStore;

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          ui: uiReducer,
        },
      });
    });

    it("renders message, title, and handles dismiss", () => {
      const onDismiss = vi.fn();
      const toastData = {
        id: "test-1",
        title: "Success Notification",
        message: "Your story is live",
        type: "success",
        count: 1,
      };

      render(
        <Provider store={mockStore}>
          <ToastItem ToastContent={toastData} onDismiss={onDismiss} />
        </Provider>
      );

      expect(screen.getByText("Success Notification")).toBeInTheDocument();
      expect(screen.getByText("Your story is live")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /dismiss notification/i });
      fireEvent.click(closeButton);
      expect(onDismiss).toHaveBeenCalledWith("test-1");
    });

    it("displays duplicate counter badge when count > 1", () => {
      const toastData = {
        id: "test-2",
        message: "Saved to folder",
        type: "success",
        count: 3,
      };

      render(
        <Provider store={mockStore}>
          <ToastItem ToastContent={toastData} />
        </Provider>
      );

      expect(screen.getByText("×3")).toBeInTheDocument();
    });

    it("shows action button and triggers callback", () => {
      const handleAction = vi.fn();
      const toastData = {
        id: "test-3",
        message: "Comment deleted",
        type: "info",
        count: 1,
        action: {
          label: "Undo",
          onClick: handleAction,
        },
      };

      render(
        <Provider store={mockStore}>
          <ToastItem ToastContent={toastData} />
        </Provider>
      );

      const actionBtn = screen.getByRole("button", { name: "Undo" });
      expect(actionBtn).toBeInTheDocument();
      fireEvent.click(actionBtn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it("toggles expandable technical details and allows copying", () => {
      const toastData = {
        id: "test-4",
        message: "Failed to connect to API",
        type: "error",
        count: 1,
        details: "NetworkTimeout: request to /api/posts failed with status 504",
      };

      render(
        <Provider store={mockStore}>
          <ToastItem ToastContent={toastData} />
        </Provider>
      );

      const detailsToggle = screen.getByRole("button", { name: /view technical details/i });
      expect(detailsToggle).toBeInTheDocument();

      fireEvent.click(detailsToggle);
      expect(screen.getByText(/NetworkTimeout/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /hide details/i })).toBeInTheDocument();
    });
  });

  describe("Standalone toast helper & toast.promise", () => {
    beforeEach(() => {
      store.dispatch(removeAllToast());
    });

    it("dispatches success toast via toast.success()", () => {
      toast.success("Profile saved!");
      const state = store.getState().ui;
      expect(state.ToastState.length).toBeGreaterThan(0);
      const last = state.ToastState[state.ToastState.length - 1];
      expect(last.message).toBe("Profile saved!");
      expect(last.type).toBe("success");
    });

    it("dispatches error toast via toast.error()", () => {
      toast.error("Operation failed");
      const state = store.getState().ui;
      const last = state.ToastState[state.ToastState.length - 1];
      expect(last.message).toBe("Operation failed");
      expect(last.type).toBe("error");
    });

    it("manages async promise lifecycle with toast.promise", async () => {
      const asyncTask = new Promise((resolve) => {
        setTimeout(() => resolve({ id: 123 }), 50);
      });

      const promiseResult = toast.promise(asyncTask, {
        loading: "Saving...",
        success: "Saved successfully!",
        error: "Failed to save",
      });

      // Verify loading state
      const loadingState = store.getState().ui.ToastState;
      expect(loadingState[loadingState.length - 1].type).toBe("loading");

      const res = await promiseResult;
      expect(res).toEqual({ id: 123 });

      // Verify transitioned to success state
      await waitFor(() => {
        const successState = store.getState().ui.ToastState;
        const current = successState[successState.length - 1];
        expect(current.type).toBe("success");
        expect(current.message).toBe("Saved successfully!");
      });
    });
  });
});
