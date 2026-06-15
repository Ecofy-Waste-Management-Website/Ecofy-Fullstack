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
            lastUpdated: new Date(Date.now() - 3600 * 1000).toISOString(),
            messages: [
              { role: 'user', text: 'Do you collect electronics?', time: new Date(Date.now() - 3600 * 1000).toISOString() },
              { role: 'bot', text: "Yes — we accept e-waste. Would you like to schedule a collection?", time: new Date(Date.now() - 3590 * 1000).toISOString() }
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
    <section className="space-y-6 text-[#244c21]">

      {/* ── HEADER ── */}
      <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="m-0 text-2xl font-black tracking-tight text-[#244c21]">Chatbot Management</h3>
            <p className="m-0 mt-1 text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest">
              View recent user chatbot sessions and read full conversations
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 px-5 py-3 text-center shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mb-1">Sessions</p>
              <p className="m-0 text-xl font-black text-[#244c21]">{sessions.length}</p>
            </div>
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 px-5 py-3 text-center shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mb-1">Messages</p>
              <p className="m-0 text-xl font-black text-[#397239]">
                {sessions.reduce((sum, s) => sum + (Array.isArray(s.messages) ? s.messages.length : 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-xs font-bold text-amber-700 shadow-sm flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          {error}
        </div>
      )}

      {/* ── SESSIONS TABLE ── */}
      <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#397234]/10 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#397239]" />
          <p className="m-0 text-[10px] font-black uppercase tracking-widest text-[#244c21]">
            All Sessions
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#397239] border-t-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/40">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <svg className="h-10 w-10 text-[#397239]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/30">No sessions available</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#397234]/10 bg-[#D6E9CA]/30">
                <tr>
                  {["User", "Email", "Messages", "Last Activity", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-[#244c21]/60">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#397239]/10">
                {sessions.map((sess) => {
                  const initials = (sess.user?.name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <tr
                      key={sess.id}
                      className="hover:bg-[#397239]/5 transition-colors cursor-pointer group"
                      onClick={() => setSelected(sess)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#397239] text-xs font-black text-white shadow-sm">
                            {initials}
                          </div>
                          <span className="font-black text-[#244c21] text-sm">{sess.user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#397239]/60 font-medium">{sess.user?.email || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#397239]/10 px-3 py-1 text-xs font-black text-[#397239]">
                          {Array.isArray(sess.messages) ? sess.messages.length : 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#397239]/60 font-medium">
                        {new Date(sess.lastUpdated || sess.updatedAt || Date.now()).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelected(sess); }}
                          className="text-[10px] font-extrabold uppercase tracking-widest text-[#397239] hover:text-[#244c21] transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                        >
                          View
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CONVERSATION MODAL ── */}
      {selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#397234]/20 bg-white shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#397234]/10 bg-[#D6E9CA]/50">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#397239] text-sm font-black text-white shadow-sm">
                  {(selected.user?.name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 className="m-0 text-sm font-black text-[#244c21]">
                    Conversation — {selected.user?.name || 'User'}
                  </h4>
                  <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mt-0.5">
                    {selected.user?.email || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 bg-[#f4f9f4]">
              {Array.isArray(selected.messages) && selected.messages.length > 0 ? (
                selected.messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-[#397239] text-white'
                        : 'bg-white border border-[#397234]/10 text-[#244c21]'
                    }`}>
                      <div className={`text-[9px] font-extrabold uppercase tracking-widest mb-1.5 ${
                        m.role === 'user' ? 'text-white/60' : 'text-[#397239]/60'
                      }`}>
                        {m.role === 'user' ? 'User' : 'Model'} • {new Date(m.time || m.timestamp || Date.now()).toLocaleString()}
                      </div>
                      <div className="text-sm font-medium leading-relaxed">{m.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <svg className="h-10 w-10 text-[#397239]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/30">No messages for this session</p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-[#397234]/10 bg-[#D6E9CA]/30 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/50">
                {Array.isArray(selected.messages) ? selected.messages.length : 0} messages in session
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl bg-[#397239] px-5 py-2.5 text-xs font-black text-white uppercase tracking-widest hover:bg-[#244c21] transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}