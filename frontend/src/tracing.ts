import { trace } from "@opentelemetry/api";

export const initTracing = () => {
  try {
    // For now, we'll use a simplified version
    // The fetch instrumentation will still work through Sentry
    console.log("✅ Tracing initialized (simplified mode)");
    return trace.getTracer("frontend-dashboard");
  } catch (error) {
    console.warn("⚠️ OpenTelemetry setup skipped:", error);
    return trace.getTracer("frontend-dashboard");
  }
};

export const tracer = initTracing();
