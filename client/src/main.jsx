import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQuery,
} from "react-query";
import { ErrorBoundary } from "react-error-boundary";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div className="flex flex-col  justify-center items-center gap-5 text-xl w-full h-screen">
              There was an error!
              <button
                className="bg-white text-black text-sm p-2 rounded-lg border-2"
                onClick={() => resetErrorBoundary()}
              >
                Try again
              </button>
            </div>
          )}
        >
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Provider>
          </QueryClientProvider>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  </React.StrictMode>
);
