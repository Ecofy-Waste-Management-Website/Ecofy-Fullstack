import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import SLAAnalytics from "./SLAAnalytics";
import ServiceRequests from "./ServiceRequests";
import ContentBlogManagement from "./contentBlogManagement";
import StaffAccountCreation from "./StaffAccountCreation";

const stats = [
  { label: "Total Revenue", value: "LKR 2,345,000", icon: "$" },
  { label: "Pending Requests", value: "41", icon: "PR" },
  { label: "Active Staff", value: "18", icon: "AS" },
  { label: "Avg. Response Time", value: "15 min", icon: "RT" },
];

const taskRows = [
  { requestId: "#REQ102", customer: "Bandara Y.", location: "Kandy", status: "Pending", assignedStaff: "Select Staff" },
  { requestId: "#REQ101", customer: "Pathirana P.", location: "Colombo", status: "In-Progress", assignedStaff: "Banuka J." },
  { requestId: "#REQ100", customer: "Mohamed A.", location: "Colombo", status: "Completed", assignedStaff: "Priyantha S." },
];

const escalations = [
  { title: "Admin Escalation", customer: "Customer: Bandara Y.", summary: "Summary pending pickup confirmation.", time: "3 sec ago" },
  { title: "Admin Escalation", customer: "Customer: Pathirana P.", summary: "Summary late route update and follow-up.", time: "3 sec ago" },
  { title: "Admin Escalation", customer: "Customer: Priyantha S.", summary: "Summary delayed escalation closure.", time: "1m ago" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const adminName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Admin";
  const adminInitials = adminName.split(" ").map(n => n[0] || "").join("").toUpperCase();

  const menuItems = [
    { label: "Dashboard", hasSubmenu: false },
    { label: "Staff Account Creation", hasSubmenu: false },
    { label: "Admin Management Module", hasSubmenu: false },
    { label: "Service Requests", hasSubmenu: false },
    { label: "SLA Analytics", hasSubmenu: false },
    { label: "Content/Blog", hasSubmenu: false },
    { label: "inquiry", hasSubmenu: false },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const renderMainContent = () => {
    if (activeTab === "SLA Analytics") return <SLAAnalytics />;
    if (activeTab === "Service Requests") return <ServiceRequests />;
    if (activeTab === "Content/Blog") return <ContentBlogManagement />;
    if (activeTab === "Staff Account Creation") return <StaffAccountCreation />;
    if (activeTab === "inquiry") return <p>inquiry</p>;
    if (activeTab === "Admin Management Module") return <p>Admin Management Module</p>;

    return (
      <>
        {/* Stats Grid */}
        <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="flex min-h-[76px] items-center gap-3 rounded-[10px] border-2 border-[#2f79bf] bg-gradient-to-b from-white to-[#f3f8ff] p-3">
              <div className="grid h-[34px] w-[34px] place-items-center rounded-lg bg-[#d8e7ff] text-[0.75rem] font-extrabold text-[#0f5cbd]">
                {stat.icon}
              </div>
              <div>
                <p className="m-0 text-[0.86rem] text-[#5f6c85]">{stat.label}</p>
                <h3 className="m-0 mt-0.5 text-[1.85rem] font-bold text-[#0f1d33]">{stat.value}</h3>
              </div>
            </article>
          ))}
        </section>

        {/* Content Grid */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_2fr_1fr]">
          
          {/* Analytics Panel */}
          <article className="rounded-[10px] border border-[#d7deea] bg-[#f7f9fc] p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="m-0 text-[1.45rem] font-bold text-[#0f1d33]">SLA &amp; Analytics</h3>
              <button className="text-[1rem] text-[#57627a] hover:text-[#0f1d33]">...</button>
            </div>
            <h4 className="mb-3 text-[1.15rem] font-bold text-[#0f1d33]">Daily Pickup Completion vs Target SLA</h4>
            
            {/* Chart Simulation */}
            <div className="relative min-h-[154px] overflow-hidden rounded-lg border border-[#d2dae8] bg-white p-3">
              {/* Grid Lines */}
              <div className="absolute left-2.5 right-2.5 top-[45px] h-px bg-[#e8eef8]"></div>
              <div className="absolute left-2.5 right-2.5 top-[95px] h-px bg-[#e8eef8]"></div>
              
              {/* Lines (using inline styles for the complex clip-paths) */}
              <div className="absolute bottom-[40px] left-4 right-4 top-[26px] origin-left rounded-full border-t-[3px] border-[#2f7ec4]" style={{ clipPath: "polygon(0 62%, 16% 53%, 33% 56%, 50% 46%, 66% 50%, 83% 34%, 100% 31%, 100% 37%, 83% 40%, 66% 56%, 50% 52%, 33% 61%, 16% 58%, 0 67%)" }}></div>
              <div className="absolute bottom-[40px] left-4 right-4 top-[26px] origin-left rounded-full border-t-[3px] border-[#0f376f]" style={{ clipPath: "polygon(0 72%, 16% 60%, 33% 46%, 50% 51%, 66% 40%, 83% 35%, 100% 24%, 100% 29%, 83% 40%, 66% 45%, 50% 56%, 33% 52%, 16% 66%, 0 78%)" }}></div>
              
              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[0.76rem] text-[#5d6a82]">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <h4 className="my-3 text-[1.15rem] font-bold text-[#0f1d33]">Waste Categories</h4>
            <div className="flex min-h-[160px] items-center justify-evenly gap-3">
              <div className="relative aspect-square w-[132px] rounded-full" style={{ background: "conic-gradient(#6fd1b9 0 50%, #143f77 50% 100%)" }}>
                <div className="absolute inset-[28px] rounded-full bg-white"></div>
              </div>
              <div className="text-[#0f1d33]">
                <p className="my-2 text-[0.92rem]"><span className="mr-1.5 inline-block h-[11px] w-[11px] rounded-full bg-[#6fd1b9]"></span> Household</p>
                <p className="my-2 text-[0.92rem]"><span className="mr-1.5 inline-block h-[11px] w-[11px] rounded-full bg-[#143f77]"></span> Industrial</p>
              </div>
            </div>
          </article>

          {/* Tasks Panel */}
          <article className="rounded-[10px] border border-[#d7deea] bg-[#f7f9fc] p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="m-0 text-[1.45rem] font-bold text-[#0f1d33]">Task Management</h3>
              <button className="text-[1rem] text-[#57627a] hover:text-[#0f1d33]">...</button>
            </div>
            <h4 className="mb-3 text-[1.15rem] font-bold text-[#0f1d33]">Active Service Requests</h4>
            <div className="overflow-auto rounded-lg border border-[#d7dfec]">
              <table className="w-full min-w-[620px] border-collapse bg-white text-left text-[0.88rem] text-[#0f1d33]">
                <thead className="bg-[#f2f6fc] font-bold">
                  <tr>
                    <th className="border-b border-[#e7edf7] p-[10px_8px]">Request ID</th>
                    <th className="border-b border-[#e7edf7] p-[10px_8px]">Customer</th>
                    <th className="border-b border-[#e7edf7] p-[10px_8px]">Location</th>
                    <th className="border-b border-[#e7edf7] p-[10px_8px]">Status</th>
                    <th className="border-b border-[#e7edf7] p-[10px_8px]">Assigned Staff</th>
                    <th className="border-b border-[#e7edf7] p-[10px_8px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taskRows.map((row) => (
                    <tr key={row.requestId}>
                      <td className="border-b border-[#e7edf7] p-[10px_8px]">{row.requestId}</td>
                      <td className="border-b border-[#e7edf7] p-[10px_8px]">{row.customer}</td>
                      <td className="border-b border-[#e7edf7] p-[10px_8px]">{row.location}</td>
                      <td className="border-b border-[#e7edf7] p-[10px_8px]">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.78rem] font-bold ${
                          row.status === "Pending" ? "bg-[#fff9de] text-[#b58907]" :
                          row.status === "In-Progress" ? "bg-[#e8f6ff] text-[#0b6ca8]" :
                          "bg-[#e8f7ee] text-[#1a7c4b]"
                        }`}>
                          <span className="h-2 w-2 rounded-full bg-current"></span>
                          {row.status}
                        </span>
                      </td>
                      <td className="border-b border-[#e7edf7] p-[10px_8px]">
                        <button className="rounded-md border border-[#c8d6ec] bg-white px-2 py-1.5 text-[0.8rem] hover:bg-gray-50">{row.assignedStaff}</button>
                      </td>
                      <td className="border-b border-[#e7edf7] p-[10px_8px]">
                        <button className="rounded-md border border-[#adc6ea] bg-[#d9e8fd] px-2 py-1.5 text-[0.8rem] font-bold text-[#114c93] hover:bg-[#c6dbfa]">View/Assign</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 h-[181px] rounded-lg border border-dashed border-[#d4ddec]"></div>
          </article>

          {/* Escalations Panel */}
          <article className="flex flex-col gap-2 rounded-[10px] border border-[#d7deea] bg-[#f7f9fc] p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="m-0 text-[1.45rem] font-bold text-[#0f1d33]">Chatbot Escalations</h3>
              <button className="text-[1rem] text-[#57627a] hover:text-[#0f1d33]">...</button>
            </div>
            {escalations.map((item) => (
              <div key={item.customer} className="border-t border-[#dbe3f0] pt-2">
                <div className="flex justify-between gap-2">
                  <p className="relative pl-[14px] font-bold text-[#0f1d33]">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#cf2436]"></span>
                    {item.title}
                  </p>
                  <span className="text-[0.76rem] text-[#68758d]">{item.time}</span>
                </div>
                <p className="my-1 text-[0.85rem] text-[#445166]">{item.customer}</p>
                <p className="my-1 text-[0.85rem] text-[#445166]">{item.summary}</p>
              </div>
            ))}
          </article>

        </section>
      </>
    );
  };

  return (
    <div className="relative grid min-h-screen grid-cols-1 font-sans text-[#0f1d33] lg:grid-cols-[220px_1fr]" style={{ background: "radial-gradient(circle at 15% 15%, #f8fbff 0%, transparent 38%), radial-gradient(circle at 90% 90%, #d8e7ff 0%, transparent 30%), #e8edf4" }}>
      
      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="w-full max-w-[400px] rounded-xl bg-white p-6 text-center shadow-2xl">
            <h3 className="mb-2.5 mt-0 text-xl font-bold text-[#0f1d33]">Confirm Logout</h3>
            <p className="mb-6 text-[0.95rem] text-[#6f7b92]">Are you sure you want to sign out of the Admin Portal?</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="rounded-md bg-[#e0e0e0] px-5 py-2 font-semibold text-[#0f1d33] transition hover:bg-[#cccccc]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSignOut} 
                className="rounded-md bg-[#cf2436] px-5 py-2 font-semibold text-white transition hover:bg-[#a81c2b]"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sticky top-0 z-10 flex flex-col gap-4 bg-gradient-to-b from-[#0f3a72] to-[#0a2a53] p-5 text-[#f5f9ff] lg:relative lg:h-screen lg:p-[20px_12px]">
        <div className="flex items-center gap-2 px-2 pb-3">
          <div className="grid h-8 w-8 place-items-center rounded-full font-bold" style={{ background: "radial-gradient(circle at 30% 30%, #5ec8ff, #0e5eb9)" }}>E</div>
          <h1 className="m-0 text-2xl tracking-[0.2px]">Ecofy</h1>
        </div>
        <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:flex lg:flex-col">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`text-left text-[0.84rem] lg:text-[0.96rem] px-2 lg:px-3 py-2 lg:py-[11px] rounded-[10px] transition-colors ${item.hasSubmenu ? "ml-0 lg:ml-4 opacity-90 py-1.5" : ""} ${activeTab === item.label ? "bg-[#1f5b9f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] text-white" : "text-[#e9f1ff] hover:bg-white/10"}`}
              onClick={() => setActiveTab(item.label)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden lg:mt-auto lg:flex items-center gap-2 rounded-xl bg-[#edf4ff] p-3 text-[#0f1d33]">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#2a4f7f] text-[0.72rem] font-bold text-white">{adminInitials}</div>
          <div>
            <p className="m-0 text-[0.8rem] text-[#5b6780]">Admin:</p>
            <p className="m-0 text-[0.9rem] font-bold">{adminName}</p>
            <button 
              className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.82rem] text-[#0f5cbd] hover:underline" 
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-[10px] lg:p-[12px_18px_10px]">
        <header className="mb-4 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="m-0 text-[1.4rem] lg:text-[2.05rem] tracking-[0.2px]">
            {activeTab === "SLA Analytics" ? "SLA & Performance Analytics" : 
             activeTab === "Service Requests" ? "Service Requests" : 
             activeTab === "Content/Blog" ? "Content & Blog Management" : "Ecofy Admin Dashboard"}
          </h2>
          <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto">
            <input type="text" className="w-full max-w-[520px] rounded-[10px] border border-[#d7deea] bg-white p-[10px_12px] outline-none focus:border-[#8eb6ee] focus:shadow-[0_0_0_3px_rgba(92,141,209,0.18)] lg:w-[320px]" placeholder="Search for requests or users" />
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[#f24f60] text-[0.76rem] font-bold text-white">7</div>
            <div className="rounded-full border border-[#d7deea] bg-white p-[8px_12px] text-[0.88rem]">{adminName}</div>
          </div>
        </header>

        {renderMainContent()}

        <footer className="mt-2.5 text-[0.84rem] text-[#5f6b82]">&copy; 2026 Ecofy Waste Management</footer>
      </main>
    </div>
  );
}