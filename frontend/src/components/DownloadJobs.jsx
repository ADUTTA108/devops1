import { ExternalLink } from 'lucide-react';

export const DownloadJobs = ({ jobs }) => {
  const jaegerUrl = import.meta.env.VITE_JAEGER_URL;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">📥 Download Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No downloads yet. Click "Start Download" to begin.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {jobs.slice(-10).reverse().map((job, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">File ID: {job.file_id}</p>
                  <p className="text-sm text-gray-600">{job.message}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  job.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
              {job.traceId && (
                <a
                  href={`${jaegerUrl}/trace/${job.traceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  View Trace: {job.traceId.substring(0, 16)}...
                </a>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(job.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};