import React, { useState } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react"; // Added useClerk
import { useNavigate } from "react-router-dom"; // For redirection
import Staff_creation_test from './Staff_creation_test';

export default function A_Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk(); // Clerk's logout function
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('staff');
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal state

  const tabs = [
    { id: 'staff', label: 'Staff Account Creation' },
    { id: 'admin', label: 'Admin Management' },
    { id: 'content', label: 'Content & Blog Management' },
    { id: 'inquiry', label: 'Inquiry' },
  ];

  // The function that actually logs you out
  const handleSignOut = async () => {
    await signOut();
    navigate("/"); // Redirect to home page after logout
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'staff': return <Staff_creation_test />;
      case 'admin': return <div><h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Administrators</h2><p className="text-gray-500">Admin management table placeholder...</p></div>;
      case 'content': return <div><h2 className="text-xl font-semibold mb-4 text-gray-700">Blog & Content Editor</h2><p className="text-gray-500">Content management placeholder...</p></div>;
      case 'inquiry': return <div><h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Inquiries</h2><p className="text-gray-500">Inquiry list placeholder...</p></div>;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      
      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800">Confirm Logout</h3>
            <p className="text-gray-600 mt-2">Are you sure you want to sign out of the Admin Portal?</p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSignOut}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* Updated Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}