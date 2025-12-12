import * as Sentry from '@sentry/react';



export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured');
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: true,
    beforeSend(event) {
      // Add trace ID to errors for correlation
      const traceId = Sentry.getActiveSpan()?.spanContext().traceId;
      if (traceId) {
        event.tags = { ...event.tags, trace_id: traceId };
      }
      return event;
    },
  });

  console.log('✅ Sentry initialized');
};