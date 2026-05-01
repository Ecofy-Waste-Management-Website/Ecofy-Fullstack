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
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#cbd9ee] bg-[linear-gradient(120deg,#f7fbff_0%,#e9f2ff_65%,#dce9ff_100%)] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="m-0 text-[1.35rem] font-bold text-[#10213d]">Inquiry Management</h3>
            <p className="m-0 mt-1 text-[0.9rem] text-[#4f6182]">Track user questions and send replies from a single workspace.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[0.85rem]">
            <div className="rounded-xl border border-[#ccd9ef] bg-white px-3 py-2">
              <p className="m-0 text-[#5c6e8d]">Total</p>
              <p className="m-0 text-[1.1rem] font-bold text-[#0f3970]">{inquiries.length}</p>
            </div>
            <div className="rounded-xl border border-[#e7dca8] bg-[#fff9df] px-3 py-2">
              <p className="m-0 text-[#847020]">Pending</p>
              <p className="m-0 text-[1.1rem] font-bold text-[#9f7f00]">{pendingCount}</p>
            </div>
            <div className="rounded-xl border border-[#bfe2ce] bg-[#ebfff2] px-3 py-2">
              <p className="m-0 text-[#2e7653]">Replied</p>
              <p className="m-0 text-[1.1rem] font-bold text-[#1d7b4d]">{repliedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
          <input
            className="w-full rounded-xl border border-[#c2d2ea] bg-white px-3 py-2.5 text-[0.9rem] outline-none focus:border-[#5d90d4] focus:shadow-[0_0_0_3px_rgba(93,144,212,0.18)]"
            placeholder="Search by name, email, subject or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl border border-[#c2d2ea] bg-white px-3 py-2.5 text-[0.9rem] outline-none focus:border-[#5d90d4]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Replied">Replied</option>
          </select>
          <button
            className="rounded-xl bg-[#0f4f99] px-4 py-2.5 text-[0.88rem] font-semibold text-white transition hover:bg-[#0a3f7b]"
            onClick={loadInquiries}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-[#f0c7cb] bg-[#ffeff1] px-4 py-2 text-[0.9rem] text-[#9f2030]">{error}</div>}

      <div className="rounded-2xl border border-[#d6dfed] bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-[#5c6e8d]">Loading inquiries...</p>
        ) : filteredInquiries.length === 0 ? (
          <p className="p-6 text-[#5c6e8d]">No inquiries found for the selected filters.</p>
        ) : (
          <div className="space-y-3 p-3 md:p-4">
            {filteredInquiries.map((item) => (
              <article key={item._id} className="rounded-xl border border-[#d8e2f1] bg-[#fbfdff] p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="m-0 text-[1rem] font-semibold text-[#10213d]">{item.subject || "General Inquiry"}</h4>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${
                          item.status === "Replied"
                            ? "bg-[#e8faef] text-[#1c7f4f]"
                            : "bg-[#fff7df] text-[#9a7900]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="m-0 mt-1 text-[0.85rem] text-[#4f6182]">
                      {item.userName} • {item.userEmail}
                    </p>
                    <p className="m-0 mt-1 text-[0.84rem] text-[#677a9b]">Submitted: {formatDate(item.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-[#dde6f3] bg-white p-3 text-[0.92rem] text-[#1f2f4b]">
                  {item.message}
                </div>

                {item.adminReply ? (
                  <div className="mt-3 rounded-lg border border-[#cde7d8] bg-[#f3fff8] p-3">
                    <p className="m-0 text-[0.78rem] font-semibold uppercase tracking-wide text-[#2f7b57]">Admin Reply</p>
                    <p className="m-0 mt-1 text-[0.92rem] text-[#1e3c2f]">{item.adminReply}</p>
                    <p className="m-0 mt-1 text-[0.76rem] text-[#5f7f70]">{item.repliedBy || "Admin"} • {formatDate(item.repliedAt)}</p>
                  </div>
                ) : null}

                <div className="mt-3 flex flex-col gap-2 md:flex-row">
                  <textarea
                    className="min-h-20.5 flex-1 rounded-lg border border-[#c8d5eb] bg-white px-3 py-2 text-[0.9rem] outline-none focus:border-[#5d90d4] focus:shadow-[0_0_0_3px_rgba(93,144,212,0.18)]"
                    placeholder="Write a response to this inquiry..."
                    value={replyText[item._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="h-fit rounded-lg bg-[#11623f] px-4 py-2.5 text-[0.88rem] font-semibold text-white transition hover:bg-[#0d4b31] disabled:cursor-not-allowed disabled:bg-[#8eb9a8]"
                    onClick={() => handleReply(item._id)}
                    disabled={savingId === item._id || !(replyText[item._id] || "").trim()}
                  >
                    {savingId === item._id ? "Sending..." : item.status === "Replied" ? "Update Reply" : "Send Reply"}
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
