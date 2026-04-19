import React, { useState } from 'react';
import { createStaffAccount } from '../services/api/adminService';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // In a real application, obtain the actual JWT from your Auth Context / Storage
      // Example: const token = await getToken() OR localStorage.getItem('token');
      const token = localStorage.getItem('token') || 'your-admin-jwt-token';
      
      const response = await createStaffAccount(formData, token);
      
      setStatus({ type: 'success', message: response.message || 'Staff created securely.' });
      
      // Clear form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-6">
      
      {/* Dashboard Header */}
      <div className="max-w-lg w-full mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage staff accounts and monitor operations.</p>
      </div>

      {/* Staff Creation Form */}
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Staff Account</h2>
        
        {status.message && (
          <div className={`p-4 mb-6 rounded-md text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Jane"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="jane.doe@ecofy.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all flex justify-center items-center gap-2 disabled:bg-blue-400"
          >
            {isLoading ? (
               <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
                'Create Staff Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
