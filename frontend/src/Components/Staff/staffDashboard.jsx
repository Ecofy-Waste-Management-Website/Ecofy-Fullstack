import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from "../Main/Top-Header-Section/NotificationBell/NotificationBell";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SERVICE_PRICES = {
  Household: 150000,
  Commercial: 350000,
  Bulk: 250000,
  Garden: 120000,
  "Drain Cleaning": 200000,
};

const BALANGODA_MAP_SRC =
  "https://www.google.com/maps?q=Balangoda%2C%20Sri%20Lanka&z=14&output=embed";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
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
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
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
        const pendingRes = await fetch(`${API_BASE_URL}/bookings`);

        if (activeRes.ok) {
          const activeData = await activeRes.json();
          setActiveTasks(activeData.data || []);
        }
        if (completedRes.ok) {
          const completedData = await completedRes.json();
          setCompletedTasks(completedData.data || []);
        }
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setPendingOrders((Array.isArray(pendingData) ? pendingData : [])
            .filter((order) => order.status === 'Pending')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
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

  const confirmPickup = async (order) => {
    if (!user?.id || confirmingOrderId === order._id) return;

    setConfirmingOrderId(order._id);
    try {
      const assignRes = await fetch(`${API_BASE_URL}/service-monitoring/${order._id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedStaff: user.id }),
      });
      const assignData = await assignRes.json();

      if (!assignRes.ok) {
        throw new Error(assignData.message || 'Failed to assign pickup');
      }

      const statusRes = await fetch(`${API_BASE_URL}/staff/tasks/${order._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Assigned', clerkId: user.id }),
      });
      const statusData = await statusRes.json();

      if (!statusRes.ok) {
        throw new Error(statusData.message || 'Failed to confirm pickup');
      }

      setPendingOrders((prev) => prev.filter((item) => item._id !== order._id));
      setActiveTasks((prev) => [
        { ...order, assignedStaff: user.id, status: 'Assigned' },
        ...prev.filter((item) => item._id !== order._id),
      ]);
      showNotification('Pickup confirmed successfully!');
      setActiveTab('active');
    } catch (err) {
      console.error('Failed to confirm pickup:', err);
      showNotification(err.message || 'Failed to confirm pickup.', 'error');
    } finally {
      setConfirmingOrderId(null);
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
      <div className="flex items-center justify-center h-screen bg-[#f4f9f4]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#397239] border-t-transparent" />
          <p className="text-[#397239] font-bold animate-pulse uppercase tracking-widest text-xs">Syncing Schedule...</p>
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
    <div key={task._id} className={`bg-[#D6E9CA]/50 backdrop-blur-[40px] rounded-3xl p-6 border border-[#397234]/20 shadow-sm transition-all hover:shadow-md hover:border-[#397239]/30 ${isCompleted ? 'opacity-80' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-black text-[#244c21] leading-tight">{task.customer_name || 'Customer'}</h3>
          <p className="text-[10px] font-bold text-[#397239]/50 uppercase tracking-[0.2em] mt-1">{task.service_type || 'General Service'}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${isCompleted ? 'bg-green-100 text-[#397239]' : getStatusColor(task.status)}`}>
          {isCompleted ? 'Completed' : task.status}
        </span>
      </div>

      <div className="bg-[#D6E9CA]/50 rounded-2xl p-4 mb-4 border border-[#397234]/10 shadow-inner">
        <p className="text-[9px] font-bold text-[#397239]/40 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Icons.MapPin /> LOCATION</p>
        <p className="text-sm text-[#244c21] font-bold leading-relaxed truncate">{task.location || 'Location missing'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#D6E9CA]/50 rounded-2xl p-3 border border-[#397234]/10">
          <p className="text-[9px] text-[#397239]/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Calendar /> DATE</p>
          <p className="text-xs font-black text-[#244c21] mt-1">{isCompleted ? formatDate(task.scheduled_date) : formatDate(task.scheduled_date)}</p>
        </div>
        <div className="bg-[#D6E9CA]/50 rounded-2xl p-3 border border-[#397234]/10">
          <p className="text-[9px] text-[#397239]/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
            {isCompleted ? <Icons.Clock /> : <Icons.Clock />} {isCompleted ? 'DONE' : 'TIME'}
          </p>
          <p className="text-xs font-black text-[#244c21] mt-1">{isCompleted ? formatTime(task.completedAt) : formatTime(task.scheduled_date)}</p>
        </div>
      </div>

      {!isCompleted && task.notes && (
        <div className="bg-amber-50/30 rounded-2xl p-3 mb-6 border border-amber-100/30">
          <p className="text-[9px] text-amber-600/50 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Notes /> NOTES</p>
          <p className="text-[0.75rem] text-amber-900 font-bold mt-1 truncate">{task.notes}</p>
        </div>
      )}

      {!isCompleted && (
        <div className="flex gap-3">
          <button
            onClick={() => updateTaskStatus(task._id, 'En Route')}
            disabled={updatingTask === task._id || task.status === 'En Route'}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              task.status === 'En Route'
                ? 'bg-[#397239]/10 text-[#397239]/40 cursor-not-allowed'
                : 'bg-[#397239] text-white hover:bg-[#244c21] shadow-md'
            }`}
          >
            {updatingTask === task._id && task.status !== 'En Route' ? '...' : <><Icons.ActiveTasks /> En Route</>}
          </button>
          <button
            onClick={() => updateTaskStatus(task._id, 'Completed')}
            disabled={updatingTask === task._id}
            className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white border border-[#397239]/20 text-[#397239] transition-all hover:bg-[#112A0F]/5"
          >
            {updatingTask === task._id ? '...' : <><Icons.CompletedTasks /> Complete</>}
          </button>
        </div>
      )}
    </div>
  );

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return `LKR ${value.toLocaleString()}`;
  };

  const getEstimatedAmount = (order) => SERVICE_PRICES[order.service_type] || order.estimated_amt || 0;

  const PendingOrdersPanel = () => (
    <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-4 min-h-[540px]">
      <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-4 shadow-sm flex flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#244c21]">Pending Orders</h3>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Orders waiting for pickup confirmation</p>
          </div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">{pendingOrders.length} orders</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#397234]/10 bg-white/70 shadow-inner flex-1">
          <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-[#397234]/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/50">
            <span>Order ID</span>
            <span>Pickup Address</span>
            <span>Estimated Amt</span>
            <span>Action</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="flex h-[360px] items-center justify-center px-6 text-center">
                <p className="text-sm font-black uppercase tracking-widest text-[#397239]/50">No pending orders available</p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div key={order._id} className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-[#397234]/10 px-4 py-4 last:border-b-0 items-center">
                  <div>
                    <p className="text-sm font-black text-[#244c21]">{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/40">{order.service_type || 'Order'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#244c21]">{order.location || 'Location missing'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#397239]">{formatCurrency(getEstimatedAmount(order))}</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => confirmPickup(order)}
                      disabled={confirmingOrderId === order._id}
                      className="rounded-xl bg-[#397239] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#244c21] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {confirmingOrderId === order._id ? 'Confirming...' : 'Confirm Pickup'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/20 p-4 shadow-sm flex flex-col min-h-[540px] overflow-hidden">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#244c21]">Balangoda Map</h3>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Center point for Balangoda, Sri Lanka</p>
          </div>
          <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">Map</div>
        </div>

        <div className="flex-1 overflow-hidden rounded-3xl border border-[#397234]/10 bg-white shadow-inner">
          <iframe
            title="Balangoda Sri Lanka map"
            src={BALANGODA_MAP_SRC}
            className="h-full w-full min-h-[480px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen font-sans text-[#244c21] bg-[#f4f9f4] p-4 lg:p-3 overflow-hidden">
      <div className="flex h-full w-full gap-3">
        
        {/* Sidebar - Floating Rounded Card */}
        <aside className="hidden lg:flex flex-col gap-4 bg-[#397234]/80 backdrop-blur-3xl border border-[#397234]/20 p-5 text-white/80 w-[240px] shrink-0 rounded-3xl shadow-2xl overflow-hidden h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-black tracking-tighter text-white">Ecofy</h1>
          </div>
          
          <nav className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex justify-between items-center text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.key 
                    ? "bg-[#397239] text-white shadow-lg shadow-black/20" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-black">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-white border border-white/10 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#397239] text-xs font-bold text-white shadow-inner">{staffInitials}</div>
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-black uppercase tracking-wider text-white/60">Staff Portal</p>
              <p className="m-0 text-xs font-bold truncate">{staffName}</p>
              <button className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.65rem] font-bold text-white/40 hover:text-white hover:underline transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Header */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-1 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-black tracking-tight text-[#244c21] truncate">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#397239]/40">
                  <Icons.Search />
                </span>
                <input type="text" className="w-full rounded-2xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-[8px_12px_8px_38px] text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:bg-white focus:shadow-md placeholder:text-[#397239]/40" placeholder="Search tasks..." />
              </div>
              <NotificationBell target="staff" />
              <div className="rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 px-3 py-1.5 text-xs font-black text-[#397239] backdrop-blur-sm">Staff</div>
              {!roleLoading && role === 'Admin' && (
                <button onClick={handleSwitchDashboard} className="rounded-xl bg-[#397239] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#244c21] shadow-md" >Switch to Admin</button>
              )}
            </div>
          </header>

          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
              {notification && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-white font-black text-sm bg-[#397239] animate-in fade-in slide-in-from-top-4 duration-300 uppercase tracking-widest">
                  {notification.message}
                </div>
              )}

              {/* Stats Bar (Clickable with Glow Effect) */}
              <section className="grid grid-cols-3 gap-3 mb-4">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                    activeTab === 'pending' 
                      ? 'border-[#397239]/60 bg-[#D6E9CA]/80 shadow-md' 
                      : 'border-[#397234]/20 bg-[#D6E9CA]/50 hover:bg-[#D6E9CA]/60 hover:shadow-sm'
                  }`}
                >
                  <p className={`text-2xl font-black leading-none ${activeTab === 'pending' ? 'text-[#397239]' : 'text-[#244c21]'}`}>
                    {pendingTasks.length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-[#397239]/60">
                    Pending
                  </p>
                </button>

                <button 
                  onClick={() => setActiveTab('active')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                    activeTab === 'active' 
                      ? 'border-[#397239]/60 bg-[#D6E9CA]/80 shadow-md' 
                      : 'border-[#397234]/20 bg-[#D6E9CA]/50 hover:bg-[#D6E9CA]/60 hover:shadow-sm'
                  }`}
                >
                  <p className={`text-2xl font-black leading-none ${activeTab === 'active' ? 'text-[#397239]' : 'text-[#244c21]'}`}>
                    {ongoingTasks.length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-[#397239]/60">
                    Active
                  </p>
                </button>

                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                    activeTab === 'completed' 
                      ? 'border-[#397239]/60 bg-[#D6E9CA]/80 shadow-md' 
                      : 'border-[#397234]/20 bg-[#D6E9CA]/50 hover:bg-[#D6E9CA]/60 hover:shadow-sm'
                  }`}
                >
                  <p className={`text-2xl font-black leading-none ${activeTab === 'completed' ? 'text-[#397239]' : 'text-[#244c21]'}`}>
                    {completedTasks.length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-[#397239]/60">
                    Completed
                  </p>
                </button>
              </section>

              {/* Task Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'pending' && (
                  <div className="col-span-full">
                    <PendingOrdersPanel />
                  </div>
                )}

                {activeTab === 'active' && (
                  ongoingTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-[#397239]/20 bg-[#D6E9CA]/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#397234]/5 flex items-center justify-center text-[#397239] border border-[#397234]/10"><Icons.ActiveTasks /></div>
                      <p className="text-[#397239]/60 font-black uppercase tracking-widest text-[10px]">No active tasks in progress.</p>
                    </div>
                  ) : (
                    ongoingTasks.map((task) => renderTaskCard(task))
                  )
                )}

                {activeTab === 'completed' && (
                  completedTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-[#397239]/20 bg-[#D6E9CA]/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#397234]/5 flex items-center justify-center text-[#397239] border border-[#397234]/10"><Icons.CompletedTasks /></div>
                      <p className="text-[#397239]/60 font-black uppercase tracking-widest text-[10px]">No tasks completed yet today.</p>
                    </div>
                  ) : (
                    completedTasks.map((task) => renderTaskCard(task, true))
                  )
                )}
              </div>
              <footer className="mt-8 text-[0.75rem] text-[#397239]/40 pb-6 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Elements */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-[#112A0F] px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><h2 className="truncate text-base font-bold leading-tight">{getPageTitle()}</h2></div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white"><Icons.Menu /></button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-green-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-[300px] flex-col gap-4 overflow-y-auto bg-[#397234]/90 backdrop-blur-3xl p-5 text-white shadow-2xl border border-white/10 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-2">
              <h1 className="m-0 text-lg font-bold">Ecofy</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 text-xs font-bold">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button key={item.key} onClick={() => { setActiveTab(item.key); setIsMobileMenuOpen(false); }} className={`flex justify-between items-center text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${activeTab === item.key ? "bg-[#397239] text-white shadow-lg" : "hover:bg-white/10"}`}>
                   <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                   {item.count > 0 && <span className="text-[10px] opacity-60">{item.count}</span>}
                </button>
              ))}
            </nav>
            <button onClick={handleSignOut} className="mt-auto w-full rounded-xl bg-white py-2.5 text-xs font-bold text-green-900">Logout</button>
          </aside>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[360px] rounded-[2rem] border border-white/20 bg-[#397234] p-8 text-center shadow-2xl backdrop-blur-[50px] animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-400/10 text-red-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-extrabold text-white">Sign Out?</h3>
            <p className="mb-8 text-xs font-bold text-white/40 uppercase tracking-widest">Are you sure you want to exit the portal?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-extrabold text-white uppercase tracking-widest transition-all hover:bg-white/10">Stay Here</button>
              <button onClick={handleSignOut} className="flex-1 rounded-2xl bg-red-500 py-4 text-[10px] font-extrabold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}