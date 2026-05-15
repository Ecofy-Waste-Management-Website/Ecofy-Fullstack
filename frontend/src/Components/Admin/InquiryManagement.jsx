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
    <section className="space-y-6 text-[#244c21]">
      <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="m-0 text-2xl font-black tracking-tight text-[#244c21]">Inquiry Workspace</h3>
            <p className="m-0 mt-1 text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest">Respond to user feedback and questions</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 p-4 shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mb-1">Total</p>
              <p className="m-0 text-xl font-black text-[#244c21]">{inquiries.length}</p>
            </div>
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 p-4 shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/80 uppercase tracking-widest mb-1">Pending</p>
              <p className="m-0 text-xl font-black text-[#397239]">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 p-4 shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mb-1">Replied</p>
              <p className="m-0 text-xl font-black text-[#244c21]">{repliedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            className="w-full flex-1 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 px-4 py-3 text-sm text-[#244c21] outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/20"
            placeholder="Filter by name, email, subject or message contents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 px-4 py-3 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all cursor-pointer font-bold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All" className="bg-white">All Statuses</option>
            <option value="Pending" className="bg-white">Pending</option>
            <option value="Replied" className="bg-white">Replied</option>
          </select>
          <button
            className="rounded-xl bg-[#397239] px-6 py-3 text-xs font-black text-white transition-all hover:scale-105 active:scale-95 shadow-md uppercase tracking-widest"
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

      <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#397239] border-t-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/20">Syncing inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/20">No matching inquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#397239]/10 p-6 space-y-6">
            {filteredInquiries.map((item) => (
              <article key={item._id} className="pt-6 first:pt-0 group">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="m-0 text-lg font-black text-[#244c21] group-hover:text-[#397239] transition-colors">{item.subject || "General Inquiry"}</h4>
                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${
                          item.status === "Replied"
                            ? "bg-green-100 text-[#397239]"
                            : "bg-[#112A0F]/10 text-[#397239]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#397239]/80 uppercase tracking-widest">
                      <span className="text-[#244c21]">{item.userName}</span>
                      <span className="h-1 w-1 rounded-full bg-[#397239]/40" />
                      <span>{item.userEmail}</span>
                    </div>
                    <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest italic">Submitted {formatDate(item.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-5 text-sm text-[#244c21] font-medium leading-relaxed shadow-inner">
                  {item.message}
                </div>

                {item.adminReply && (
                  <div className="mt-4 rounded-2xl border border-[#112A0F]/20 bg-white p-5 relative overflow-hidden group/reply shadow-sm">
                    <div className="absolute top-0 right-0 p-3 opacity-5 text-[#397239]">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    </div>
                    <p className="m-0 text-[9px] font-black uppercase tracking-[0.2em] text-[#397239] mb-2">Previous Response</p>
                    <p className="m-0 text-sm text-[#397239] font-medium leading-relaxed italic">{item.adminReply}</p>
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-[#397239]/60 uppercase tracking-widest">
                      <span className="text-[#397239]">{item.repliedBy || "Admin"}</span>
                      <span className="h-1 w-1 rounded-full bg-[#397239]/20" />
                      <span>{formatDate(item.repliedAt)}</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-4 md:flex-row">
                  <textarea
                    className="min-h-[100px] flex-1 rounded-2xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-4 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/40 leading-relaxed"
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
                    className="h-fit rounded-2xl bg-[#397239] px-6 py-4 text-xs font-black text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale uppercase tracking-widest shadow-md"
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
