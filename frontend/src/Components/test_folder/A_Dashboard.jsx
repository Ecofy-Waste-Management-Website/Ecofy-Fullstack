import React, { useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import Staff_creation_test from './Staff_creation_test';

export default function A_Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('staff'); // Set default tab

  // Define your sidebar tabs
  const tabs = [
    { id: 'staff', label: 'Staff Account Creation' },
    { id: 'admin', label: 'Admin Management' },
    { id: 'content', label: 'Content & Blog Management' },
    { id: 'inquiry', label: 'Inquiry' },
  ];

  // Render the correct component/content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'staff':
        return (
          <div>
          <Staff_creation_test/>
          </div>
        );
      case 'admin':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Administrators</h2>
            {/* Data table goes here */}
            <p className="text-gray-500">Admin management table placeholder...</p>
          </div>
        );
      case 'content':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Blog & Content Editor</h2>
            {/* Editor/List goes here */}
            <p className="text-gray-500">Content management placeholder...</p>
          </div>
        );
      case 'inquiry':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Inquiries</h2>
            {/* Messages list goes here */}
            <p className="text-gray-500">Inquiry list placeholder...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">
            Welcome, {user?.firstName || 'Admin'}
          </p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Optional Footer/Logout Area inside Sidebar */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          {/* Add quick actions or profile picture here if needed */}
        </header>

        {/* Dynamic Content Container */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-full">
            {renderContent()}
          </div>
        </div>
      </main>

    </div>
  );
}