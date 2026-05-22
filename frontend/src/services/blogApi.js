// Blog API Service - Backend Integration with Cloudinary
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// GET ALL BLOG POSTS
export const fetchBlogPosts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`${API_BASE_URL}/blog?${queryParams}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

// GET SINGLE BLOG POST
export const fetchBlogPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
};

// CREATE BLOG POST WITH IMAGE
export const createBlogPost = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create blog post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

// UPDATE BLOG POST WITH IMAGE
export const updateBlogPost = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update blog post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

// DELETE BLOG POST
export const deleteBlogPost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete blog post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};

// HELPER: Create FormData from blog object
export const createBlogFormData = (blog, imageFile = null) => {
  const formData = new FormData();
  
  formData.append('title', blog.title || '');
  formData.append('category', blog.category || 'Recycling Tips');
  formData.append('author', blog.author || 'Admin');
  formData.append('excerpt', blog.excerpt || '');
  formData.append('content', blog.content || '');
  formData.append('status', blog.status || 'Draft');
  
  if (blog.tags) {
    const tagsArray = Array.isArray(blog.tags) ? blog.tags : [];
    formData.append('tags', JSON.stringify(tagsArray));
  }
  
  // Add image file if provided
  if (imageFile) {
    formData.append('featuredImage', imageFile);
  }
  
  return formData;
};
