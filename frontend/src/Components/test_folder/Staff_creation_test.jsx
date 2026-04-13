import React, { useState } from 'react';
import { useAuth } from "@clerk/clerk-react"; // 1. IMPORT THIS

export default function Staff_creation_test() {
  
  // 2. GRAB THE GET-TOKEN FUNCTION FROM CLERK
  const { getToken } = useAuth(); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', 
    role: 'Staff'
  });
  
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault(); 
    setStatusMessage('Creating account...');

    try {
      // 3. FETCH THE FRESH TOKEN RIGHT BEFORE THE REQUEST
      const token = await getToken(); 

      const response = await fetch('http://localhost:5000/admin/create-staff', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 4. ATTACH THE TOKEN TO THE HEADERS
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
      console.error(error); // Helpful for debugging!
      setStatusMessage('Server error. Please check if your backend is running.');
    }
  };

  // ==========================================
  // 2. THE FACE: UI goes INSIDE the return
  // ==========================================
  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Staff</h2>

      {/* Status Message Display */}
      {statusMessage && (
        <div className={`p-3 mb-6 rounded-md text-sm ${
          statusMessage.includes('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 
          statusMessage === 'Creating account...' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {statusMessage}
        </div>
      )}

      {/* The Form */}
      <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Staff Email Address"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Assign a Temporary Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          required
          minLength="8" 
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Create Staff Account
        </button>
      </form>
    </div>
  );
}