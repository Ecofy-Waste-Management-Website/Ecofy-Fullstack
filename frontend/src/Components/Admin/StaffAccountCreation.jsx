import React, { useState } from 'react';
import { useAuth } from "@clerk/clerk-react";

export default function Staff_creation_test() {
  const { getToken } = useAuth(); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', 
    role: 'Staff'
  });
  
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault(); 
    setStatusMessage('Creating account...');
    setIsLoading(true);

    try {
      const token = await getToken(); 

      const response = await fetch('http://localhost:5000/admin/create-staff', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage('Success! Staff account created.');
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'Staff' });
      } else {
        setStatusMessage(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('Server error. Please check if your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-xl text-blue-600">
          👤
        </div>
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-800">Create New Staff</h2>
          <p className="m-0 text-sm text-gray-500">Add a new operational team member.</p>
        </div>
      </div>

      {/* Status Message Display */}
      {statusMessage && (
        <div className={`mb-6 rounded-md border p-3 text-sm font-medium ${
          statusMessage.includes('Success') ? 'border-green-200 bg-green-50 text-green-700' : 
          statusMessage === 'Creating account...' ? 'border-blue-200 bg-blue-50 text-blue-700' : 
          'border-red-200 bg-red-50 text-red-700'
        }`}>
          {statusMessage}
        </div>
      )}

      {/* The Form */}
      <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="e.g. Nimal"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="e.g. Perera"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="staff@ecofy.lk"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Temporary Password</label>
          <input
            type="password"
            name="password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            required
            minLength="8" 
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-lg bg-[#0f5cbd] py-2.5 font-bold text-white transition-colors hover:bg-[#0b4899] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Creating Account..." : "Create Staff Account"}
        </button>
      </form>
    </div>
  );
}