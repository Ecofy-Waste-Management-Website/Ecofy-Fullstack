import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-4 border-b border-gray-50 pb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
            <Icons.UserPlus />
          </div>
          <div>
            <h2 className="m-0 text-xl font-bold text-gray-800 tracking-tight">Create New Staff</h2>
            <p className="m-0 text-sm text-gray-500 font-medium">Add a new operational team member to the platform.</p>
          </div>
        </div>

        {/* Status Message Display */}
        {statusMessage && (
          <div className={`mb-6 rounded-xl border p-4 text-sm font-bold shadow-sm transition-all animate-in fade-in slide-in-from-top-1 ${
            statusMessage.includes('Success') ? 'border-green-100 bg-green-50 text-[#397239]' : 
            statusMessage === 'Creating account...' ? 'border-blue-100 bg-blue-50 text-blue-700' : 
            'border-red-100 bg-red-50 text-red-700'
          }`}>
            {statusMessage}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleCreateStaff} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Nimal"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Perera"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
            <input
              type="text"
              name="username"
              placeholder="e.g. nimal.perera"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
              required
            />
            <p className="mt-1.5 text-[0.7rem] font-medium text-gray-400">Lowercase letters, numbers, dots, or hyphens (3-30 chars).</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="staff@ecofy.lk"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Temporary Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
              required
              minLength="8" 
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Generating Account..." : "Register Staff Member"}
          </button>
        </form>
      </div>

      <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Staff Registry</h3>
            <p className="text-sm font-medium text-gray-500">Directory of all active and inactive operational personnel.</p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
              <Icons.Search />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name..."
              className="w-full rounded-full border border-gray-100 bg-gray-50/80 py-2.5 pl-11 pr-4 text-sm text-gray-700 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-50">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.1em] font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4 text-center">Role</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Management</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 bg-white text-[0.85rem] text-gray-600">
                {!isTableLoading && filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff._id} className="transition-colors hover:bg-gray-50/30">
                      <td className="px-6 py-4 font-bold text-gray-900">{`${staff.firstName || ''} ${staff.lastName || ''}`.trim()}</td>
                      <td className="px-6 py-4 text-center"><span className="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500">{staff.role}</span></td>
                      <td className="px-6 py-4 font-medium">{staff.email}</td>
                      <td className="px-6 py-4 font-medium">{formatDate(staff.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            (staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')) === 'Active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${ (staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')) === 'Active' ? 'bg-green-500' : 'bg-rose-500' }`} />
                          {staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(staff)}
                            className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-[0.75rem] font-bold text-blue-700 transition-all hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-blue-200"
                          >
                            <Icons.Edit /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff._id, `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'this staff member')}
                            disabled={deletingStaffId === staff._id}
                            className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-[0.75rem] font-bold text-red-700 transition-all hover:bg-red-600 hover:text-white shadow-sm hover:shadow-red-200 disabled:opacity-50"
                          >
                            <Icons.Delete /> {deletingStaffId === staff._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isTableLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        <p className="text-xs font-bold text-gray-400">Syncing with Registry...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-bold italic">
                      No personnel records match “{searchTerm}”
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="m-0 text-2xl font-bold text-gray-900 tracking-tight">Edit Staff Profile</h4>
            <p className="mt-1.5 text-sm font-medium text-gray-500">Modify existing account permissions and details.</p>

            <form onSubmit={handleUpdateStaff} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full rounded-xl border border-gray-100 bg-gray-100/50 px-3 py-3 text-sm text-gray-400 outline-none"
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Role</label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Account Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="Activate">Active</option>
                    <option value="Suspended">Inactive</option>
                    <option value="Banned">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStaff}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
                >
                  {isUpdatingStaff ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}