import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { tracer } from '../tracing';
import { api } from '../api/client';
import { HealthStatus } from './HealthStatus';
import { DownloadJobs } from './DownloadJobs';
import { ErrorLog } from './ErrorLog';
import { PerformanceMetrics } from './PerformanceMetrics';
import { AlertCircle, Download, ExternalLink } from 'lucide-react';

const DashboardComponent = () => {
  const [health, setHealth] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const span = tracer.startSpan('dashboard-load');
    
    const fetchHealth = async () => {
      try {
        const response = await api.getHealth();
        setHealth(response.data);
      } catch (error) {
        console.error('Health check failed:', error);
        setErrors(prev => [...prev, {
          timestamp: new Date().toISOString(),
          message: 'Health check failed',
          error
        }]);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    
    span.end();
    return () => clearInterval(interval);
  }, []);

  const handleTestError = async () => {
    const span = tracer.startSpan('sentry-test');
    try {
      await api.checkDownload(70000, true);
    } catch (error) {
      setErrors(prev => [...prev, {
        timestamp: new Date().toISOString(),
        message: 'Sentry test error triggered',
        traceId: span.spanContext().traceId,
        error: error.response?.data
      }]);
    } finally {
      span.end();
    }
  };

  const handleStartDownload = async () => {
    const span = tracer.startSpan('start-download');
    const fileId = Math.floor(Math.random() * 100000);
    
    try {
      const response = await api.startDownload(fileId);
      setJobs(prev => [...prev, {
        ...response.data,
        timestamp: new Date().toISOString(),
        traceId: span.spanContext().traceId,
      }]);
    } catch (error) {
      setErrors(prev => [...prev, {
        timestamp: new Date().toISOString(),
        message: 'Download failed',
        traceId: span.spanContext().traceId,
        error: error.response?.data
      }]);
    } finally {
      span.end();
    }
  };

  const jaegerUrl = import.meta.env.VITE_JAEGER_URL;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            📊 Observability Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your download service with Sentry error tracking and OpenTelemetry distributed tracing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <HealthStatus health={health} />
          <PerformanceMetrics />
        </div>

        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            onClick={handleStartDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Download size={20} />
            Start Download
          </button>
          <button
            onClick={handleTestError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <AlertCircle size={20} />
            Test Sentry Error
          </button>
          <a
            href={jaegerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <ExternalLink size={20} />
            Open Jaeger UI
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DownloadJobs jobs={jobs} />
          <ErrorLog errors={errors} />
        </div>
      </div>
    </div>
  );
};

export const Dashboard = Sentry.withProfiler(DashboardComponent);