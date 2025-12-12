import { AlertCircle, ExternalLink } from 'lucide-react';

export const ErrorLog = ({ errors }) => {
  const jaegerUrl = import.meta.env.VITE_JAEGER_URL;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <AlertCircle className="text-red-500" />
        Error Log
      </h2>
      {errors.length === 0 ? (
        <p className="text-gray-500">No errors yet. Great! 🎉</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {errors.slice(-10).reverse().map((error, idx) => (
            <div key={idx} className="border border-red-200 rounded p-3 bg-red-50">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={16} />
                <div className="flex-1">
                  <p className="font-medium text-red-800">{error.message}</p>
                  {error.error?.message && (
                    <p className="text-sm text-red-600 mt-1">{error.error.message}</p>
                  )}
                  {error.traceId && (
                    <a
                      href={`${jaegerUrl}/trace/${error.traceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 mt-2"
                    >
                      <ExternalLink size={12} />
                      Trace: {error.traceId.substring(0, 16)}...
                    </a>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};