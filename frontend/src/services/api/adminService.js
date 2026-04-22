// The base URL should ideally come from environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export const getBlogPosts = async (params, token) => {
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  return await requestJson(`/admin/blog-posts?${searchParams.toString()}`, token, {
    method: 'GET',
  });
};

export const createBlogPost = async (postData, token) => {
  return await requestJson('/admin/blog-posts', token, {
    method: 'POST',
    body: JSON.stringify(postData),
  });
};

export const updateBlogPost = async (postId, postData, token) => {
  return await requestJson(`/admin/blog-posts/${postId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(postData),
  });
};

export const deleteBlogPost = async (postId, token) => {
  return await requestJson(`/admin/blog-posts/${postId}`, token, {
    method: 'DELETE',
  });
};
