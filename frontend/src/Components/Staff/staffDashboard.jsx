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
const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconTruck = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1m-4-4h4m4 0h2a1 1 0 011 1v3a1 1 0 01-1 1h-1m-5-10l4.293 4.293A1 1 0 0119 11.707V14" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconNotes = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconCategory = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const IconSuccess = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconClipboard = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

export default function StaffDashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [notification, setNotification] = useState(null);


  // Fetch tasks from backend
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
        const activeRes = await fetch(
          `${API_BASE_URL}/staff/tasks/active/${user.id}`
        );
        const completedRes = await fetch(
          `${API_BASE_URL}/staff/tasks/completed/${user.id}`
        );

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

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    if (updatingTask === taskId) return; // prevent double click

    setUpdatingTask(taskId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/staff/tasks/${taskId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            clerkId: user.id,
          }),
        }
      );
  const data = await res.json();
      if (res.ok) {
        if (newStatus === 'Completed') {
          const task = activeTasks.find(t => t._id === taskId);
          setActiveTasks(prev => prev.filter(t => t._id !== taskId));
          setCompletedTasks(prev => [
            { ...task, status: 'Completed', completedAt: new Date() },
            ...prev,
          ]);
           showNotification('Task completed successfully!');
          // Switch to completed tab
          setTimeout(() => setActiveTab('completed'), 500);
        } else {
          setActiveTasks(prev =>
            prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t)
          );
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

  const getStatusColor = (status) => {
    return STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSwitchDashboard = () => {
    navigate('/admin-dashboard');
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/50 relative overflow-hidden">
      {/* Background Pattern Animation */}
      <style>{`
        @keyframes scrollPattern {
          from { background-position: 0 0; }
          to { background-position: 300px 150px; }
        }
        .animate-logo-pattern {
          animation: scrollPattern 40s linear infinite;
        }
      `}</style>

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-5 animate-logo-pattern"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='150' viewBox='0 0 300 150' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='75' y='40' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-weight='800' font-size='24' fill='%23218845' transform='rotate(-20, 75, 40)'%3EEcofy%3C/text%3E%3Ctext x='225' y='110' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-weight='800' font-size='24' fill='%23218845' transform='rotate(-20, 225, 110)'%3EEcofy%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm
          transition-all duration-300
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      {/* Navbar-style Action Card (Glassmorphism) */}
      <div className="mx-auto mb-10 w-full rounded-[40px] bg-emerald-100/40 backdrop-blur-md border border-emerald-200/60 p-1.5 shadow-sm transition-all duration-500">
        <div className="flex flex-col items-center justify-between gap-6 px-8 py-6 lg:flex-row lg:gap-4">
          <div className="text-center lg:text-left">
            <h2 className="text-xl font-bold tracking-tight text-green-900 sm:text-2xl">
              Welcome, {user?.firstName || 'Staff Member'}
            </h2>
            <p className="mt-1 text-sm text-green-700/70 flex items-center justify-center lg:justify-start gap-1.5">
              <IconCalendar className="w-4 h-4 opacity-70" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 w-full lg:w-auto">
            {!roleLoading && role === 'Admin' && (
              <button
                type="button"
                onClick={handleSwitchDashboard}
                className="px-5 py-2 rounded-full font-medium text-gray-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
              >
                Admin
              </button>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="px-5 py-2 rounded-full font-medium text-gray-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-none border border-[#218845]/40 bg-[#218845]/5 backdrop-blur-md p-4 shadow-[0_0_15px_rgba(33,136,69,0.1)] ring-1 ring-[#218845]/10 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(33,136,69,0.2)] hover:bg-[#218845]/10">
          <p className="text-2xl font-bold text-green-700">{activeTasks.length}</p>
          <p className="text-xs font-semibold text-green-600/70 mt-0.5 uppercase tracking-wider">Active Tasks</p>
        </div>
        <div className="rounded-none border border-[#218845]/40 bg-[#218845]/5 backdrop-blur-md p-4 shadow-[0_0_15px_rgba(33,136,69,0.1)] ring-1 ring-[#218845]/10 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(33,136,69,0.2)] hover:bg-[#218845]/10">
          <p className="text-2xl font-bold text-green-700">{completedTasks.length}</p>
          <p className="text-xs font-semibold text-green-600/70 mt-0.5 uppercase tracking-wider">Completed Today</p>
        </div>
        <div className="rounded-none border border-[#218845]/40 bg-[#218845]/5 backdrop-blur-md p-4 shadow-[0_0_15px_rgba(33,136,69,0.1)] ring-1 ring-[#218845]/10 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(33,136,69,0.2)] hover:bg-[#218845]/10">
          <p className="text-2xl font-bold text-amber-600">
            {activeTasks.filter(t => t.status === 'Pending').length}
          </p>
          <p className="text-xs font-semibold text-green-600/70 mt-0.5 uppercase tracking-wider">Pending Assignment</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white/40 backdrop-blur-sm p-1 rounded-2xl border border-green-200 mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'active'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-green-800/60 hover:text-green-800 hover:bg-white/20'
          }`}
        >
          <IconTruck className={activeTab === 'active' ? "w-4 h-4" : "w-4 h-4 opacity-50"} />
          Active ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-green-800/60 hover:text-green-800 hover:bg-white/20'
          }`}
        >
          <IconCheck className={activeTab === 'completed' ? "w-4 h-4" : "w-4 h-4 opacity-50"} />
          Completed ({completedTasks.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Active Tracking Tab */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTasks.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-green-300/50 p-12 text-center bg-emerald-50 shadow-inner">
                <IconSuccess className="w-12 h-12 mx-auto mb-4 text-green-200" />
                <p className="text-gray-500 font-medium">No active tasks right now!</p>
              </div>
            ) : (
              activeTasks.map((task) => (
                <div key={task._id}
                  className="bg-emerald-50/90 backdrop-blur-sm rounded-3xl shadow-sm p-6 border border-emerald-100 transition-all duration-300 hover:shadow-md hover:bg-emerald-50">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {task.customer_name || 'Customer'}
                      </h3>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                        {task.service_type || 'General Service'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <IconMapPin className="w-3 h-3" /> PICKUP LOCATION
                    </p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {task.location || 'Location not specified'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50">
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <IconCalendar className="w-3 h-3" /> DATE
                      </p>
                      <p className="text-sm font-bold text-blue-700 mt-1">
                        {formatDate(task.scheduled_date)}
                      </p>
                    </div>
                    <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/50">
                      <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <IconClock className="w-3 h-3" /> TIME
                      </p>
                      <p className="text-sm font-bold text-purple-700 mt-1">
                        {formatTime(task.scheduled_date)}
                      </p>
                    </div>
                  </div>

                  {task.notes && (
                    <div className="bg-amber-50/50 rounded-2xl p-3 mb-6 border border-amber-100/50">
                      <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1">
                        <IconNotes className="w-3 h-3" /> NOTES
                      </p>
                      <p className="text-sm text-amber-800 mt-1">{task.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => updateTaskStatus(task._id, 'En Route')}
                      disabled={updatingTask === task._id || task.status === 'En Route'}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                        ${task.status === 'En Route'
                          ? 'bg-cyan-100 text-cyan-600 cursor-not-allowed'
                          : updatingTask === task._id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-600 text-white hover:bg-cyan-700 active:scale-95 shadow-sm'}`}
                    >
                      {updatingTask === task._id && task.status !== 'En Route' ? '⏳...' : (
                        <><IconTruck className="w-4 h-4" /> En Route</>
                      )}
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task._id, 'Completed')}
                      disabled={updatingTask === task._id}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                        ${updatingTask === task._id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm'}`}
                    >
                      {updatingTask === task._id ? '⏳...' : (
                        <><IconCheck className="w-4 h-4" /> Complete</>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Completed Today Tab */}
        {activeTab === 'completed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedTasks.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-green-300/50 p-12 text-center bg-emerald-50 shadow-inner">
                <IconClipboard className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                <p className="text-gray-500 font-medium">No completed tasks yet today.</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div key={task._id}
                  className="bg-emerald-50/90 backdrop-blur-sm rounded-3xl shadow-sm p-6 border border-emerald-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {task.customer_name || 'Customer'}
                      </h3>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                        {task.service_type || 'General Service'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      bg-emerald-100 text-emerald-700">
                      Completed
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <IconMapPin className="w-3 h-3" /> PICKUP LOCATION
                    </p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {task.location || 'Location not specified'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/50">
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <IconCheck className="w-3 h-3" /> COMPLETED
                      </p>
                      <p className="text-sm font-bold text-emerald-700 mt-1">
                        {formatTime(task.completedAt) || 'Today'}
                      </p>
                    </div>
                    <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/50">
                      <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <IconCategory className="w-3 h-3" /> SERVICE
                      </p>
                      <p className="text-sm font-bold text-purple-700 mt-1">
                        {task.service_type || 'General'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}