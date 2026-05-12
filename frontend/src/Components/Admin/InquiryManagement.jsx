import React, { useEffect, useMemo, useState } from "react";
import { getInquiries, replyToInquiry } from "../../services/api/adminService";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [replyText, setReplyText] = useState({});
  const [savingId, setSavingId] = useState("");

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await getInquiries();
      setInquiries(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const text = `${item.userName} ${item.userEmail} ${item.subject} ${item.message}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, search, statusFilter]);

  const pendingCount = inquiries.filter((item) => item.status === "Pending").length;
  const repliedCount = inquiries.filter((item) => item.status === "Replied").length;

  const handleReply = async (inquiryId) => {
    const value = (replyText[inquiryId] || "").trim();
    if (!value) return;

    try {
      setSavingId(inquiryId);
      const updated = await replyToInquiry(inquiryId, value, "Admin");
      setInquiries((prev) => prev.map((inq) => (inq._id === inquiryId ? updated : inq)));
      setReplyText((prev) => ({ ...prev, [inquiryId]: "" }));
    } catch (err) {
      setError(err.message || "Failed to send reply.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[50px] p-6 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="m-0 text-2xl font-extrabold tracking-tight">Inquiry Workspace</h3>
            <p className="m-0 mt-1 text-[10px] font-bold text-white/40 uppercase tracking-widest">Respond to user feedback and questions</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-inner">
              <p className="m-0 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Total</p>
              <p className="m-0 text-xl font-extrabold text-white">{inquiries.length}</p>
            </div>
            <div className="rounded-2xl border border-[#66c45e]/20 bg-[#66c45e]/5 p-4 shadow-inner">
              <p className="m-0 text-[10px] font-bold text-[#66c45e]/40 uppercase tracking-widest mb-1">Pending</p>
              <p className="m-0 text-xl font-extrabold text-[#66c45e]">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
              <p className="m-0 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Replied</p>
              <p className="m-0 text-xl font-extrabold text-white/60">{repliedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            className="w-full flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#66c45e] transition-all placeholder:text-white/10"
            placeholder="Filter by name, email, subject or message contents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#66c45e] transition-all cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All" className="bg-[#244c21]">All Statuses</option>
            <option value="Pending" className="bg-[#244c21]">Pending</option>
            <option value="Replied" className="bg-[#244c21]">Replied</option>
          </select>
          <button
            className="rounded-xl bg-[#66c45e] px-6 py-3 text-xs font-extrabold text-[#051F10] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#66c45e]/20 uppercase tracking-widest"
            onClick={loadInquiries}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-xs font-bold text-red-400 shadow-xl animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            {error}
          </span>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-[50px] shadow-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#66c45e] border-t-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Syncing inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">No matching inquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 p-6 space-y-6">
            {filteredInquiries.map((item) => (
              <article key={item._id} className="pt-6 first:pt-0 group">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="m-0 text-lg font-extrabold text-white group-hover:text-[#66c45e] transition-colors">{item.subject || "General Inquiry"}</h4>
                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${
                          item.status === "Replied"
                            ? "bg-green-400/20 text-green-400"
                            : "bg-[#66c45e]/10 text-[#66c45e]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <span className="text-white/60">{item.userName}</span>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span>{item.userEmail}</span>
                    </div>
                    <p className="m-0 text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Submitted {formatDate(item.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/80 leading-relaxed shadow-inner">
                  {item.message}
                </div>

                {item.adminReply && (
                  <div className="mt-4 rounded-2xl border border-[#66c45e]/20 bg-[#66c45e]/5 p-5 relative overflow-hidden group/reply">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    </div>
                    <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#66c45e] mb-2">Previous Response</p>
                    <p className="m-0 text-sm text-white/90 leading-relaxed italic">{item.adminReply}</p>
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                      <span className="text-[#66c45e]/60">{item.repliedBy || "Admin"}</span>
                      <span className="h-1 w-1 rounded-full bg-white/10" />
                      <span>{formatDate(item.repliedAt)}</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-4 md:flex-row">
                  <textarea
                    className="min-h-[100px] flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#66c45e] focus:bg-white/10 transition-all placeholder:text-white/10 leading-relaxed"
                    placeholder="Draft your professional response here..."
                    value={replyText[item._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="h-fit rounded-2xl bg-[#66c45e] px-6 py-4 text-xs font-extrabold text-[#051F10] transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale uppercase tracking-widest shadow-lg shadow-[#66c45e]/10"
                    onClick={() => handleReply(item._id)}
                    disabled={savingId === item._id || !(replyText[item._id] || "").trim()}
                  >
                    {savingId === item._id ? "Sending..." : item.status === "Replied" ? "Update Reply" : "Send Response"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
