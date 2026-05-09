import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route": "bg-cyan-100 text-cyan-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Delayed: "bg-red-100 text-red-700",
};

// --- Professional Icons (Inline SVGs) ---
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  PendingTasks: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ActiveTasks: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1m-4-4h4m4 0h2a1 1 0 011 1v3a1 1 0 01-1 1h-1m-5-10l4.293 4.293A1 1 0 0119 11.707V14" />
    </svg>
  ),
  CompletedTasks: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Notes: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Search: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
};

export default function StaffDashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // Default to Pending
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const staffName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Staff Member";
  const staffInitials = staffName.split(" ").map(n => n[0] || "").join("").toUpperCase();

  // Fetch tasks and role
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchRole = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setRole(data.user.role);
        }
      } catch (error) {
        console.error('Failed to fetch staff role:', error);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();

    const fetchTasks = async () => {
      try {
        const activeRes = await fetch(`${API_BASE_URL}/staff/tasks/active/${user.id}`);
        const completedRes = await fetch(`${API_BASE_URL}/staff/tasks/completed/${user.id}`);

        if (activeRes.ok) {
          const activeData = await activeRes.json();
          setActiveTasks(activeData.data || []);
        }
        if (completedRes.ok) {
          const completedData = await completedRes.json();
          setCompletedTasks(completedData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [isLoaded, user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    if (updatingTask === taskId) return;
    setUpdatingTask(taskId);
    try {
      const res = await fetch(`${API_BASE_URL}/staff/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, clerkId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        if (newStatus === 'Completed') {
          const task = activeTasks.find(t => t._id === taskId);
          setActiveTasks(prev => prev.filter(t => t._id !== taskId));
          setCompletedTasks(prev => [{ ...task, status: 'Completed', completedAt: new Date() }, ...prev]);
          showNotification('Task completed successfully!');
          setTimeout(() => setActiveTab('completed'), 500);
        } else {
          setActiveTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
          showNotification(`Status updated to ${newStatus}`);
        }
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showNotification('Failed to update status. Please try again.', 'error');
    } finally {
      setUpdatingTask(null);
    }
  };

  const getStatusColor = (status) => STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSwitchDashboard = () => navigate('/admin-dashboard');

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-emerald-900 font-bold animate-pulse">Syncing with Schedule...</p>
        </div>
      </div>
    );
  }

  // Filter tasks for each menu item
  const pendingTasks = activeTasks.filter(t => t.status === 'Pending');
  const ongoingTasks = activeTasks.filter(t => t.status !== 'Pending');

  const menuItems = [
    { label: 'Pending Tasks', key: 'pending', icon: <Icons.PendingTasks />, count: pendingTasks.length },
    { label: 'Active Tasks', key: 'active', icon: <Icons.ActiveTasks />, count: ongoingTasks.length },
    { label: 'Completed Today', key: 'completed', icon: <Icons.CompletedTasks />, count: completedTasks.length },
  ];

  const getPageTitle = () => menuItems.find(m => m.key === activeTab)?.label || "Staff Dashboard";

  const renderTaskCard = (task, isCompleted = false) => (
    <div key={task._id} className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100 shadow-sm transition-all hover:shadow-md ${isCompleted ? 'opacity-80' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-950 leading-tight">{task.customer_name || 'Customer'}</h3>
          <p className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-[0.2em] mt-1">{task.service_type || 'General Service'}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-emerald-100 text-emerald-700' : getStatusColor(task.status)}`}>
          {isCompleted ? 'Completed' : task.status}
        </span>
      </div>

      <div className="bg-emerald-50/50 rounded-2xl p-4 mb-4 border border-emerald-100/50">
        <p className="text-[9px] font-bold text-emerald-600/40 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Icons.MapPin /> LOCATION</p>
        <p className="text-sm text-emerald-950 font-semibold leading-relaxed truncate">{task.location || 'Location missing'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-50/30 rounded-2xl p-3 border border-emerald-100/30">
          <p className="text-[9px] text-emerald-600/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Calendar /> DATE</p>
          <p className="text-xs font-bold text-emerald-900 mt-1">{isCompleted ? formatDate(task.scheduled_date) : formatDate(task.scheduled_date)}</p>
        </div>
        <div className="bg-emerald-50/30 rounded-2xl p-3 border border-emerald-100/30">
          <p className="text-[9px] text-emerald-600/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
            {isCompleted ? <Icons.Clock /> : <Icons.Clock />} {isCompleted ? 'DONE' : 'TIME'}
          </p>
          <p className="text-xs font-bold text-emerald-900 mt-1">{isCompleted ? formatTime(task.completedAt) : formatTime(task.scheduled_date)}</p>
        </div>
      </div>

      {!isCompleted && task.notes && (
        <div className="bg-amber-50/30 rounded-2xl p-3 mb-6 border border-amber-100/30">
          <p className="text-[9px] text-amber-600/50 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Notes /> NOTES</p>
          <p className="text-[0.75rem] text-amber-900/80 mt-1 truncate">{task.notes}</p>
        </div>
      )}

      {!isCompleted && (
        <div className="flex gap-3">
          <button
            onClick={() => updateTaskStatus(task._id, 'En Route')}
            disabled={updatingTask === task._id || task.status === 'En Route'}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              task.status === 'En Route'
                ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10'
            }`}
          >
            {updatingTask === task._id && task.status !== 'En Route' ? '...' : <><Icons.ActiveTasks /> En Route</>}
          </button>
          <button
            onClick={() => updateTaskStatus(task._id, 'Completed')}
            disabled={updatingTask === task._id}
            className="flex-1 py-3 rounded-2xl text-xs font-bold bg-white border border-emerald-200 text-emerald-700 transition-all hover:bg-emerald-50"
          >
            {updatingTask === task._id ? '...' : <><Icons.CompletedTasks /> Complete</>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen w-screen font-sans text-gray-900 bg-emerald-50/50 p-4 lg:p-3 overflow-hidden">
      <div className="flex h-full w-full gap-3">
        
        {/* Sidebar - Floating Rounded Card */}
        <aside className="hidden lg:flex flex-col gap-4 bg-emerald-900/40 backdrop-blur-xl border border-white/10 p-5 text-white w-[240px] shrink-0 rounded-3xl shadow-xl overflow-hidden h-full">
          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-bold tracking-tight">Ecofy</h1>
          </div>
          
          <nav className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex justify-between items-center text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.key 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
                    : "text-emerald-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-emerald-900/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-white border border-white/5 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-inner">{staffInitials}</div>
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-300/80">Staff Portal</p>
              <p className="m-0 text-xs font-bold truncate">{staffName}</p>
              <button className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.65rem] font-bold text-white/60 hover:text-white hover:underline transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Header */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-1 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-bold tracking-tight text-emerald-900 truncate">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search />
                </span>
                <input type="text" className="w-full rounded-2xl border border-emerald-100 bg-white/60 p-[8px_12px_8px_38px] text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-900/5 placeholder:text-gray-400" placeholder="Search tasks..." />
              </div>
              <div className="relative cursor-pointer" onClick={() => setActiveTab('pending')}>
                <div className={`grid h-9 w-9 place-items-center rounded-full border transition-all shadow-sm ${activeTab === 'pending' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}>
                  <Icons.Bell />
                </div>
                {pendingTasks.length > 0 && (
                  <div className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">{pendingTasks.length}</div>
                )}
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/60 px-3 py-1.5 text-xs font-bold text-emerald-900 backdrop-blur-sm">Staff</div>
              {!roleLoading && role === 'Admin' && (
                <button onClick={handleSwitchDashboard} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700 shadow-md shadow-emerald-900/10">Switch to Admin</button>
              )}
            </div>
          </header>

          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
              {notification && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-white font-bold text-sm bg-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
                  {notification.message}
                </div>
              )}

              {/* Stats Bar (Clickable with Glow Effect) */}
              <section className="grid grid-cols-3 gap-3 mb-4">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white/40 backdrop-blur-md ${
                    activeTab === 'pending' 
                      ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-white/70' 
                      : 'border-emerald-200/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <p className="text-2xl font-bold leading-none text-emerald-700">
                    {pendingTasks.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-600/60">
                    Pending
                  </p>
                </button>

                <button 
                  onClick={() => setActiveTab('active')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white/40 backdrop-blur-md ${
                    activeTab === 'active' 
                      ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-white/70' 
                      : 'border-emerald-200/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <p className="text-2xl font-bold leading-none text-emerald-700">
                    {ongoingTasks.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-600/60">
                    Active
                  </p>
                </button>

                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white/40 backdrop-blur-md ${
                    activeTab === 'completed' 
                      ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-white/70' 
                      : 'border-emerald-200/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <p className="text-2xl font-bold leading-none text-emerald-700">
                    {completedTasks.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-600/60">
                    Completed
                  </p>
                </button>
              </section>

              {/* Task Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'pending' && (
                  pendingTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-white/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icons.PendingTasks /></div>
                      <p className="text-emerald-900/60 font-bold tracking-tight">All caught up! No pending tasks.</p>
                    </div>
                  ) : (
                    pendingTasks.map((task) => renderTaskCard(task))
                  )
                )}

                {activeTab === 'active' && (
                  ongoingTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-white/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icons.ActiveTasks /></div>
                      <p className="text-emerald-900/60 font-bold tracking-tight">No active tasks in progress.</p>
                    </div>
                  ) : (
                    ongoingTasks.map((task) => renderTaskCard(task))
                  )
                )}

                {activeTab === 'completed' && (
                  completedTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-white/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icons.CompletedTasks /></div>
                      <p className="text-emerald-900/60 font-bold tracking-tight">No tasks completed yet today.</p>
                    </div>
                  ) : (
                    completedTasks.map((task) => renderTaskCard(task, true))
                  )
                )}
              </div>
              <footer className="mt-8 text-[0.75rem] text-emerald-800/40 pb-6 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Elements */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-emerald-100/50 bg-emerald-900/95 px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><h2 className="truncate text-base font-bold leading-tight">{getPageTitle()}</h2></div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white"><Icons.Menu /></button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-[300px] flex-col gap-4 overflow-y-auto bg-emerald-900/90 backdrop-blur-xl p-5 text-white shadow-2xl border border-white/10 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-2">
              <h1 className="m-0 text-lg font-bold">Ecofy</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 text-xs font-bold">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button key={item.key} onClick={() => { setActiveTab(item.key); setIsMobileMenuOpen(false); }} className={`flex justify-between items-center text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all ${activeTab === item.key ? "bg-emerald-600" : "hover:bg-white/10"}`}>
                   <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                   {item.count > 0 && <span className="text-[10px] opacity-60">{item.count}</span>}
                </button>
              ))}
            </nav>
            <button onClick={handleSignOut} className="mt-auto w-full rounded-xl bg-white py-2.5 text-xs font-bold text-emerald-900">Logout</button>
          </aside>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-3xl bg-white p-6 text-center shadow-2xl">
            <h3 className="mb-2 text-xl font-bold text-emerald-900 tracking-tight">Confirm Sign Out</h3>
            <p className="mb-6 text-sm text-gray-500">Are you sure you want to exit the Staff Portal?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-2xl bg-gray-100 py-3 text-sm font-bold text-gray-600">Cancel</button>
              <button onClick={handleSignOut} className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}