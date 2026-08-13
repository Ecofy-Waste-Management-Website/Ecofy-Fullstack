import React, { useEffect, useState } from 'react';

const rawApiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || window.location.origin;
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Unknown time' : date.toLocaleString();
};

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/system-logs`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load system logs.');
        setLogs(Array.isArray(data.logs) ? data.logs : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Failed to load system logs.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadLogs();
    return () => controller.abort();
  }, []);

  return (
    <section className="rounded-3xl border border-[#06a63e]/15 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#03652a]">System Logs</h3>
        <p className="mt-1 text-sm text-[#397239]/65">Completed system requests, newest first.</p>
      </div>

      {loading ? <p className="py-10 text-center font-semibold text-[#397239]/60">Loading system logs...</p> : error ? (
        <p className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">{error}</p>
      ) : logs.length === 0 ? (
        <p className="py-10 text-center font-semibold text-[#397239]/60">No system logs have been recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[#06a63e]/15 text-xs uppercase tracking-wider text-[#397239]/60">
              <tr><th className="px-3 py-3">Timestamp</th><th className="px-3 py-3">Method</th><th className="px-3 py-3">Route</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actor</th></tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-[#06a63e]/10 text-[#244c21]">
                  <td className="whitespace-nowrap px-3 py-4 font-medium">{formatTimestamp(log.createdAt)}</td>
                  <td className="px-3 py-4 font-black">{log.method}</td>
                  <td className="px-3 py-4 font-mono text-xs">{log.path}</td>
                  <td className="px-3 py-4"><span className={log.statusCode >= 400 ? 'font-black text-red-600' : 'font-black text-[#06a63e]'}>{log.statusCode}</span></td>
                  <td className="px-3 py-4 text-xs text-[#397239]/70">{log.actorId || 'System / anonymous'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
