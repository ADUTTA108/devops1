import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { initSentry } from "./sentry";
import { initTracing } from "./tracing";
import "./index.css";
import App from "./App";

// Initialize observability
initSentry();
initTracing();

// eslint-disable-next-line react-refresh/only-export-components
const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-gray-700 mb-4">{error.message}</p>
      <button
        onClick={resetError}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Try again
      </button>
    </div>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
