import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function StaffDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('active');
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchTasks = async () => {
      try {
        // Fetch active tasks
        const activeRes = await fetch(
          `http://localhost:5000/staff/tasks/active/${user.id}`
        );
        const completedRes = await fetch(
          `http://localhost:5000/staff/tasks/completed/${user.id}`
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'En Route': return 'bg-blue-100 text-blue-700';
      case 'Assigned': return 'bg-purple-100 text-purple-700';
      case 'Pending': return 'bg-gray-100 text-gray-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Staff Dashboard</h1>
            <p className="text-green-100 text-sm">
              Welcome, {user?.firstName || 'Staff Member'}
            </p>
            <p className="text-green-200 text-xs mt-1">
              📅 {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
          <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
            {user?.firstName?.[0] || 'S'}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-green-500 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold">{activeTasks.length}</p>
            <p className="text-xs text-green-100">Active</p>
          </div>
          <div className="bg-green-500 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold">{completedTasks.length}</p>
            <p className="text-xs text-green-100">Completed</p>
          </div>
          <div className="bg-green-500 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold">
              {activeTasks.filter(t => t.status === 'Pending').length}
            </p>
            <p className="text-xs text-green-100">Pending</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'active'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-500'
          }`}
        >
          🚛 Active Tracking ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'completed'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-500'
          }`}
        >
          ✅ Completed Today ({completedTasks.length})
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">

        {/* Active Tracking Tab */}
        {activeTab === 'active' && (
          <>
            {activeTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">🎉</p>
                <p className="text-gray-500">No active tasks right now!</p>
              </div>
            ) : (
              activeTasks.map((task) => (
                <div key={task._id} 
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">
                        {task.customer_name || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {task.request_id || task._id}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Service Zone & Address */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      📍 SERVICE ZONE & ADDRESS
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      {task.location || 'Location not specified'}
                    </p>
                  </div>

                  {/* Schedule Info */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-500 font-semibold">📅 DATE</p>
                      <p className="text-sm font-medium text-blue-700">
                        {formatDate(task.scheduled_date)}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-xs text-purple-500 font-semibold">🗂️ SERVICE</p>
                      <p className="text-sm font-medium text-purple-700">
                        {task.service_type || 'General'}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {task.notes && (
                    <div className="bg-yellow-50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-yellow-600 font-semibold">📝 NOTES</p>
                      <p className="text-sm text-yellow-700">{task.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg 
                      text-sm font-medium active:bg-blue-600">
                      🚛 En Route
                    </button>
                    <button className="flex-1 bg-green-500 text-white py-2 rounded-lg 
                      text-sm font-medium active:bg-green-600">
                      ✅ Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Completed Today Tab */}
        {activeTab === 'completed' && (
          <>
            {completedTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-gray-500">No completed tasks yet today.</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div key={task._id} 
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-800">
                        {task.customer_name || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-400">{task._id}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium 
                      bg-green-100 text-green-700">
                      Completed
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      📍 SERVICE ZONE & ADDRESS
                    </p>
                    <p className="text-sm text-gray-700">
                      {task.location || 'Location not specified'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-xs text-green-500 font-semibold">✅ COMPLETED</p>
                      <p className="text-sm font-medium text-green-700">
                        {formatTime(task.completedAt) || 'Today'}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-xs text-purple-500 font-semibold">🗂️ SERVICE</p>
                      <p className="text-sm font-medium text-purple-700">
                        {task.service_type || 'General'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
}