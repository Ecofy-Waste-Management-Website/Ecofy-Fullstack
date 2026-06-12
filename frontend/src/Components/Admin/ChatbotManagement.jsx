import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ChatbotManagement() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/chatbot/sessions`);
        if (!res.ok) throw new Error('No sessions endpoint');
        const data = await res.json();
        if (!mounted) return;
        setSessions(Array.isArray(data.sessions) ? data.sessions : []);
      } catch (err) {
        const mock = [
          {
            id: 's1',
            user: { id: 'u1', name: 'Jane Doe', email: 'jane@example.com' },
            lastUpdated: new Date().toISOString(),
            messages: [
              { role: 'user', text: 'Hi, how do I book a pickup?', time: new Date().toISOString() },
              { role: 'bot', text: "Sure — I can help with that. What type of waste?", time: new Date().toISOString() }
            ]
          },
          {
            id: 's2',
            user: { id: 'u2', name: 'Kamal Perera', email: 'kamal@example.com' },
            lastUpdated: new Date(Date.now()-3600*1000).toISOString(),
            messages: [
              { role: 'user', text: 'Do you collect electronics?', time: new Date(Date.now()-3600*1000).toISOString() },
              { role: 'bot', text: "Yes — we accept e-waste. Would you like to schedule a collection?", time: new Date(Date.now()-3590*1000).toISOString() }
            ]
          }
        ];
        if (mounted) {
          setSessions(mock);
          setError('Could not fetch sessions from backend; using mock data.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSessions();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col h-full gap-6 p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-600 text-gray-800">Chatbot Management</h3>
        <p className="text-sm text-gray-500">View recent user chatbot sessions and read full conversations.</p>
      </div>

      <div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-xl p-4 shadow-sm overflow-auto">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-500">Loading sessions...</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="text-xs font-600 uppercase tracking-wider text-gray-900 border-b border-white/20">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Messages</th>
                <th className="p-3">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {sessions.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-sm text-gray-500">No sessions available.</td></tr>
              ) : sessions.map(sess => (
                <tr key={sess.id} className="hover:bg-white/50 transition-colors cursor-pointer" onClick={() => setSelected(sess)}>
                  <td className="p-3 font-600 text-gray-900">{sess.user?.name || 'Unknown'}</td>
                  <td className="p-3 text-xs text-gray-600">{sess.user?.email || '-'}</td>
                  <td className="p-3">{Array.isArray(sess.messages) ? sess.messages.length : 0}</td>
                  <td className="p-3 text-xs text-gray-500">{new Date(sess.lastUpdated || sess.updatedAt || Date.now()).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <div className="mt-3 text-xs text-yellow-700">{error}</div>}
      </div>

      {/* Modal — single Close button in header only */}
      {selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/30 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Header with single Close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div>
                <h4 className="text-lg font-600">Conversation — {selected.user?.name || 'User'}</h4>
                <p className="text-xs text-gray-500">{selected.user?.email || ''}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Close
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {Array.isArray(selected.messages) && selected.messages.length > 0 ? (
                selected.messages.map((m, idx) => (
                  <div key={idx} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-xl px-4 py-2 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <div className="text-xs opacity-60 mb-1">{m.role.toUpperCase()} • {new Date(m.time || m.timestamp || Date.now()).toLocaleString()}</div>
                      <div className="text-sm">{m.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-gray-500">No messages for this session.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}