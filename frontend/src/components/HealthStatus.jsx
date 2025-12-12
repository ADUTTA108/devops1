import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const HealthStatus = ({ health }) => {
  if (!health) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">🏥 Health Status</h2>
        <div className="flex items-center gap-2">
          <Loader className="animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const isHealthy = health.status === 'healthy' && health.checks?.storage === 'ok';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">🏥 Health Status</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Overall Status:</span>
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-green-600 font-bold">Healthy</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={20} />
                <span className="text-red-600 font-bold">Unhealthy</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Storage (S3):</span>
          <div className="flex items-center gap-2">
            {health.checks?.storage === 'ok' ? (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-green-600">OK</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={20} />
                <span className="text-red-600">Error</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};