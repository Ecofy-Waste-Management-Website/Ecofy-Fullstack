const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const parseJsonResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Blog request failed');
  }

  return data;
};

export const fetchPublishedBlogPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/blog?status=Published`);
  const data = await parseJsonResponse(response);
  return Array.isArray(data.posts) ? data.posts : [];
};

export const fetchBlogPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch blog post (${response.status})`);
    }

    const data = await response.json();
    console.log('Blog post response:', data);
    
    // Backend returns post object directly
    if (data._id) {
      return data;
    }
    
    // Fallback for wrapped responses
    return data.post || (Array.isArray(data.posts) ? data.posts[0] : data);
  } catch (error) {
    console.error('Blog post fetch error:', error);
    throw error;
  }
};
