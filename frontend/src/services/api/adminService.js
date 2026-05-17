// The base URL should ideally come from environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const requestJson = async (path, token, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

/**
 * Creates a new staff member account.
 * Restricts access to strictly admin authorized requests.
 * @param {Object} staffData - The staff member details (firstName, email, password)
 * @param {String} token - Admin JWT token
 * @returns {Promise<Object>} The API response
 */
export const createStaffAccount = async (staffData, token) => {
  try {
    return await requestJson('/admin/create-staff', token, {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  } catch (error) {
    throw error;
  }
};

export const getInquiries = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/inquiries`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch inquiries.");
  }

  return data.inquiries || [];
};

export const replyToInquiry = async (inquiryId, reply, repliedBy) => {
  const response = await fetch(`${API_BASE_URL}/admin/inquiries/${inquiryId}/reply`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reply, repliedBy }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reply to inquiry.");
  }

  return data.inquiry;
};

export const submitInquiry = async (inquiryData) => {
  const response = await fetch(`${API_BASE_URL}/users/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit inquiry.");
  }

  return data.inquiry;
};
