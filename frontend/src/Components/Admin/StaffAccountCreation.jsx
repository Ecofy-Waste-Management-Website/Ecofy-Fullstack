import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="e.g. nimal.perera"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Use 3-30 lowercase letters, numbers, dot, underscore, or hyphen.</p>
          </div>

          <div className="flex-1">
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

      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registered Staff</h3>
            <p className="text-sm text-gray-500">All personnel currently assigned to the project.</p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or role"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-gray-700 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Registration Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                {!isTableLoading && filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff._id} className="transition-colors hover:bg-blue-50/40">
                      <td className="px-4 py-3 font-medium text-gray-900">{`${staff.firstName || ''} ${staff.lastName || ''}`.trim()}</td>
                      <td className="px-4 py-3">{staff.role}</td>
                      <td className="px-4 py-3">{staff.email}</td>
                      <td className="px-4 py-3">{formatDate(staff.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            (staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')) === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                          }`}
                        >
                          {staff.displayStatus || (staff.status === 'Activate' ? 'Active' : 'Inactive')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(staff)}
                            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff._id, `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'this staff member')}
                            disabled={deletingStaffId === staff._id}
                            className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white"
                          >
                            {deletingStaffId === staff._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isTableLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading staff from MongoDB...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                      No staff found for “{searchTerm}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-gray-900">Edit Staff Account</h4>
            <p className="mt-1 text-sm text-gray-500">Update staff profile details from the users collection.</p>

            <form onSubmit={handleUpdateStaff} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 outline-none"
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Activate">Active</option>
                    <option value="Suspended">Inactive</option>
                    <option value="Banned">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStaff}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isUpdatingStaff ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}