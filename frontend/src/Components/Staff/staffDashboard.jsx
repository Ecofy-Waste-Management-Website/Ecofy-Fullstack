import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function StaffDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('active');

  // Dummy data for now
  const activeTasks = [
    {
      id: '#REQ001',
      customer: 'Kamal Perera',
      address: 'No 12, Galle Road, Colombo 03',
      serviceType: 'Household',
      scheduledTime: '9:00 AM',
      status: 'Pending',
    },
    {
      id: '#REQ002',
      customer: 'Nimal Silva',
      address: 'No 45, Kandy Road, Nugegoda',
      serviceType: 'Commercial',
      scheduledTime: '10:30 AM',
      status: 'En Route',
    },
    {
      id: '#REQ003',
      customer: 'Amara Fernando',
      address: 'No 78, Maharagama Road',
      serviceType: 'Bulk',
      scheduledTime: '11:00 AM',
      status: 'Pending',
    },
  ];

  const completedTasks = [
    {
      id: '#REQ099',
      customer: 'Saman Jayawardena',
      address: 'No 23, Battaramulla Road',
      serviceType: 'Garden',
      completedTime: '8:30 AM',
      status: 'Completed',
    },
    {
      id: '#REQ098',
      customer: 'Priya Rajapaksa',
      address: 'No 56, Dehiwala Road',
      serviceType: 'Household',
      completedTime: '7:45 AM',
      status: 'Completed',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'En Route': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
          </div>
          <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center font-bold">
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
            {activeTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{task.customer}</p>
                    <p className="text-xs text-gray-500">{task.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">📍 {task.address}</p>
                <p className="text-sm text-gray-600 mb-3">
                  🕐 {task.scheduledTime} · 🗂️ {task.serviceType}
                </p>
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium">
                    🚛 En Route
                  </button>
                  <button className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium">
                    ✅ Complete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Completed Today Tab */}
        {activeTab === 'completed' && (
          <>
            {completedTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{task.customer}</p>
                    <p className="text-xs text-gray-500">{task.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">📍 {task.address}</p>
                <p className="text-sm text-gray-600">
                  ✅ Completed at {task.completedTime} · 🗂️ {task.serviceType}
                </p>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}