// The base URL should ideally come from environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Creates a new staff member account.
 * Restricts access to strictly admin authorized requests.
 * @param {Object} staffData - The staff member details (firstName, email, password)
 * @param {String} token - Admin JWT token
 * @returns {Promise<Object>} The API response
 */
export const createStaffAccount = async (staffData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/create-staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(staffData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create staff account. Please check your credentials.');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};
