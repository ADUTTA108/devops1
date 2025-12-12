import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Clock } from 'lucide-react';

export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    avgResponseTime: 0,
    successRate: 100,
    totalRequests: 0,
  });

  useEffect(() => {
    // Simulate performance tracking
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          setMetrics(prev => ({
            ...prev,
            avgResponseTime: Math.round(entry.responseEnd - entry.requestStart),
          }));
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="text-purple-500" />
        Performance Metrics
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Clock className="mx-auto text-blue-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-800">{metrics.avgResponseTime}ms</p>
          <p className="text-xs text-gray-500">Avg Response</p>
        </div>
        <div className="text-center">
          <TrendingUp className="mx-auto text-green-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-800">{metrics.successRate}%</p>
          <p className="text-xs text-gray-500">Success Rate</p>
        </div>
        <div className="text-center">
          <Activity className="mx-auto text-purple-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-800">{metrics.totalRequests}</p>
          <p className="text-xs text-gray-500">Total Requests</p>
        </div>
      </div>
    </div>
  );
};