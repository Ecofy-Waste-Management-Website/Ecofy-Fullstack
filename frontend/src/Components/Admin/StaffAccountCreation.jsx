import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  UserPlus: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  Search: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Edit: () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  Delete: () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
};

const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const emptyEditForm = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 'Staff',
  status: 'Activate',
};

export default function Staff_creation_test() {
  const { getToken } = useAuth(); 

  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    lastName: '',
    email: '',
    password: '', 
    role: 'Staff'
  });
  
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [deletingStaffId, setDeletingStaffId] = useState('');
  const [isUpdatingStaff, setIsUpdatingStaff] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const fetchStaff = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/admin/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStaffList(data.staff || []);
      } else {
        setStatusMessage(`Error: ${data.message || 'Failed to fetch staff accounts.'}`);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('Server error while fetching registered staff.');
    } finally {
      setIsTableLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return staffList;

    return staffList.filter((staff) => {
      const fullName = `${staff.firstName || ''} ${staff.lastName || ''}`.trim().toLowerCase();
      return (
        fullName.includes(query) ||
        (staff.role || '').toLowerCase().includes(query)
      );
    });
  }, [searchTerm, staffList]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault(); 
    setStatusMessage('Creating account...');
    setIsLoading(true);

    try {
      const token = await getToken(); 

      const response = await fetch(`${API_BASE_URL}/admin/create-staff`, {
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
        setFormData({ firstName: '', username: '', lastName: '', email: '', password: '', role: 'Staff' });
        await fetchStaff();
      } else {
        setStatusMessage(`Error: ${data.error || data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('Server error. Please check if your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (staff) => {
    setEditForm({
      id: staff._id,
      firstName: staff.firstName || '',
      lastName: staff.lastName || '',
      email: staff.email || '',
      role: staff.role || 'Staff',
      status: staff.status || 'Activate',
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm(emptyEditForm);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setIsUpdatingStaff(true);

    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/admin/staff/${editForm.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          role: editForm.role,
          status: editForm.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(`Error: ${data.message || 'Failed to update staff account.'}`);
        return;
      }

      setStatusMessage('Success! Staff account updated.');
      handleCloseEditModal();
      await fetchStaff();
    } catch (error) {
      console.error(error);
      setStatusMessage('Server error while updating staff account.');
    } finally {
      setIsUpdatingStaff(false);
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    const confirmDelete = window.confirm(`Delete ${staffName}? This action cannot be undone.`);

    if (!confirmDelete) return;

    setDeletingStaffId(staffId);
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/admin/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(`Error: ${data.message || 'Failed to delete staff account.'}`);
        return;
      }

      setStatusMessage('Success! Staff account deleted.');
      await fetchStaff();
    } catch (error) {
      console.error(error);
      setStatusMessage('Server error while deleting staff account.');
    } finally {
      setDeletingStaffId('');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      {/* Creation Card */}
      <div className="w-full rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-5 border-b border-[#397234]/10 pb-6">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#397234]/10 text-[#397239] shadow-inner border border-[#397234]/10">
            <Icons.UserPlus />
          </div>
          <div>
            <h2 className="m-0 text-2xl font-black text-[#244c21] tracking-tight">Create New Staff</h2>
            <p className="m-0 text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest mt-1">Onboard operational personnel to the platform</p>
          </div>
        </div>

        {/* Status Message Display */}
        {statusMessage && (
          <div className={`mb-8 rounded-2xl border p-5 text-xs font-bold shadow-xl transition-all animate-in fade-in slide-in-from-top-2 ${
            statusMessage.includes('Success') ? 'border-green-400/20 bg-green-400/10 text-green-400' : 
            statusMessage === 'Creating account...' ? 'border-blue-400/20 bg-blue-400/10 text-blue-400' : 
            'border-red-400/20 bg-red-400/10 text-red-400'
          }`}>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {statusMessage}
            </span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleCreateStaff} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Nimal"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-3.5 text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:bg-white placeholder:text-[#397239]/20"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Perera"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-3.5 text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:bg-white placeholder:text-[#397239]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Account Username</label>
            <input
              type="text"
              name="username"
              placeholder="e.g. nimal.perera"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-3.5 text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:bg-white placeholder:text-[#397239]/20"
              required
            />
            <p className="mt-2 text-[10px] font-medium text-[#397239]/30 italic">Letters, numbers, dots, or hyphens only.</p>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Corporate Email</label>
            <input
              type="email"
              name="email"
              placeholder="staff@ecofy.lk"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-3.5 text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:bg-white placeholder:text-[#397239]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Default Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-3.5 text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:bg-white placeholder:text-[#397239]/20"
              required
              minLength="8" 
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-xl bg-[#397239] py-4 font-extrabold text-white shadow-lg shadow-[#397239]/10 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {isLoading ? "Generating Secure Account..." : "Register New Personnel"}
          </button>
        </form>
      </div>

      {/* Registry Table Card */}
      <div className="w-full rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-black text-[#244c21] tracking-tight">Staff Registry</h3>
            <p className="text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest mt-1">Operational personnel directory</p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#397239]/40">
              <Icons.Search />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-full border border-[#397234]/10 bg-[#D6E9CA]/50 py-3 pl-11 pr-4 text-sm text-[#244c21] shadow-inner outline-none transition focus:border-[#397239] focus:bg-white placeholder:text-[#397239]/20"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#397234]/20 bg-white/40">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#244c21]">
              <thead className="bg-[#397234]/10 text-[10px] uppercase tracking-widest font-black text-[#397239]">
                <tr>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4 text-center">Role</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#397239]/5">
                {!isTableLoading && filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff._id} className="transition-colors hover:bg-[#397234]/5">
                      <td className="px-6 py-5 font-black text-[#244c21]">{`${staff.firstName || ''} ${staff.lastName || ''}`.trim()}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="rounded-lg bg-[#397234]/5 border border-[#397234]/5 px-2.5 py-1 text-[9px] font-extrabold uppercase text-[#397239] tracking-tighter">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-[#244c21]">{staff.email}</td>
                      <td className="px-6 py-5 font-medium text-[#397239]/80">{formatDate(staff.createdAt)}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${
                            (staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')) === 'Active'
                              ? 'bg-green-400/20 text-green-400'
                              : 'bg-rose-400/20 text-rose-400'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${ (staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')) === 'Active' ? 'bg-green-400' : 'bg-rose-400' }`} />
                          {staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(staff)}
                            className="flex items-center gap-2 rounded-xl bg-[#397234]/5 px-4 py-2 text-[10px] font-bold text-[#397239] uppercase tracking-widest transition-all hover:bg-[#397234]/10 border border-[#397234]/10"
                          >
                            <Icons.Edit /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff._id, `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'this staff member')}
                            disabled={deletingStaffId === staff._id}
                            className="flex items-center gap-2 rounded-xl bg-red-400/10 px-4 py-2 text-[10px] font-bold text-red-400 uppercase tracking-widest transition-all hover:bg-red-400/20 border border-red-400/20 disabled:opacity-50"
                          >
                            <Icons.Delete /> {deletingStaffId === staff._id ? '...' : 'Del'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isTableLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#397239] border-t-transparent" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/60">Syncing Registry...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-[#397239]/20 font-bold uppercase tracking-widest text-xs italic">
                      No matching personnel found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#397234]/20 p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="m-0 text-2xl font-black text-[#244c21] tracking-tight">Edit Profile</h4>
            <p className="mt-1 text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest">Update permissions & details</p>

            <form onSubmit={handleUpdateStaff} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-[#112A0F]/10 bg-white p-3.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-[#112A0F]/10 bg-white p-3.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Email (Fixed)</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  className="w-full rounded-xl border border-[#397239]/5 bg-[#112A0F]/5 px-4 py-3.5 text-sm text-[#397239]/40 outline-none cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Role</label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-[#112A0F]/10 bg-white p-3.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all"
                  >
                    <option value="Staff" className="bg-white">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#397239]/70">Account Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-[#112A0F]/10 bg-white p-3.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all"
                  >
                    <option value="Activate" className="bg-white">Active</option>
                    <option value="Suspended" className="bg-white">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 rounded-xl border border-white/10 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStaff}
                  className="flex-1 rounded-xl bg-[#397239] py-4 text-[10px] font-extrabold text-white shadow-lg shadow-[#397239]/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                >
                  {isUpdatingStaff ? 'Updating...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}