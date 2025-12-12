import axios from "axios";
import * as Sentry from "@sentry/react";
import { trace } from "@opentelemetry/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 35000,
});

// Add trace context to requests
apiClient.interceptors.request.use((config) => {
  const span = trace.getActiveSpan();
  const traceId = span?.spanContext().traceId;

  if (traceId) {
    config.headers["X-Trace-Id"] = traceId;
  }

  return config;
});

// Capture errors in Sentry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error, {
      tags: {
        api_endpoint: error.config?.url,
        status_code: error.response?.status,
      },
    });
    return Promise.reject(error);
  },
);

export interface HealthResponse {
  status: string;
  checks: {
    storage: string;
  };
}

export interface DownloadCheckResponse {
  file_id: number;
  available: boolean;
  message?: string;
}

export interface DownloadStartResponse {
  job_id: string;
  file_id: number;
  status: string;
  message: string;
}

export const api = {
  getHealth: () => apiClient.get<HealthResponse>("/health"),

  checkDownload: (fileId: number, sentryTest = false) =>
    apiClient.post<DownloadCheckResponse>(
      "/v1/download/check",
      { file_id: fileId },
      { params: sentryTest ? { sentry_test: "true" } : {} },
    ),

  startDownload: (fileId: number) =>
    apiClient.post<DownloadStartResponse>("/v1/download/start", {
      file_id: fileId,
    }),
};
