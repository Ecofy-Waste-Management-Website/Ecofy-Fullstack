const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Creates a new waste-collection pickup request.
 * @param {Object} bookingData - { customer_name, customer_email, customer_phone, service_type, waste_category, location, scheduled_date, notes }
 * @returns {Promise<Object>} The saved booking object
 */
export const createPickupRequest = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create pickup request.');
  }

  return data.booking;
};

/**
 * Fetches all bookings for the given customer email.
 * @param {string} email
 * @returns {Promise<Array>}
 */
export const getUserBookings = async (email) => {
  const response = await fetch(`${API_BASE_URL}/bookings/user/${encodeURIComponent(email)}`);

  // 404 means no bookings — not an error for us
  if (response.status === 404) return [];

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bookings.');
  }

  return Array.isArray(data) ? data : [];
};

export const getUserPayments = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/payments/user/${encodeURIComponent(email)}`);

  if (response.status === 404) return [];

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch payments.');
  }

  return Array.isArray(data) ? data : [];
};