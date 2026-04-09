import React, { useState } from 'react';
import axios from 'axios';

const CreateStaff = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remember to attach your Admin's JWT token in the headers
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      
      const response = await axios.post('/api/admin/create-staff', formData, config);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', password: '', role: 'staff' }); // Reset form
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="admin-section">
      <h2>Create New Staff Account</h2>
      {message && <p className="alert">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" name="name" placeholder="Full Name" 
          value={formData.name} onChange={handleChange} required 
        />
        <input 
          type="email" name="email" placeholder="Work Email" 
          value={formData.email} onChange={handleChange} required 
        />
        <input 
          type="password" name="password" placeholder="Temporary Password" 
          value={formData.password} onChange={handleChange} required 
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="staff">General Staff</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateStaff;