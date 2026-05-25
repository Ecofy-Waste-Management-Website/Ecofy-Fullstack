import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, FileText, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { Button, Badge } from './UIComponents';

import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createBlogFormData,
} from "../../services/blogApi";

const CATEGORIES = ["Recycling Tips", "Community Events", "Eco-Guides"];
const NEW_POST_ID = "__new__";

const blankForm = () => ({
  _id: NEW_POST_ID,
  title: "",
  category: "Recycling Tips",
  author: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  tags: [],
  status: "Draft",
});

const hydrateForm = (post) => {
  if (!post) return null;
  return {
    _id: post._id || NEW_POST_ID,
    title: post.title || "",
    category: post.category || "Recycling Tips",
    author: post.author || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    featuredImage: post.featuredImage || "",
    tags: Array.isArray(post.tags) ? post.tags : [],
    status: post.status || "Draft",
  };
};

export default function ContentBlogManagement() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editorForm, setEditorForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { posts: articles = [] } = await fetchBlogPosts({ limit: 100 });
        setPosts(articles);
        if (articles.length > 0) {
          setEditingPostId(articles[0]._id);
          setEditorForm(hydrateForm(articles[0]));
        }
      } catch {
        setError("Failed to load blog posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||
          p.author.toLowerCase().includes(searchText.toLowerCase())
      ),
    [posts, searchText]
  );

  const selectPost = (post) => {
    setEditingPostId(post._id);
    setEditorForm(hydrateForm(post));
    setImageFile(null);
    setImagePreview(post.featuredImage || "");
    setError(null);
    setMessage("");
  };

  const handleNewPost = () => {
    setEditingPostId(NEW_POST_ID);
    setEditorForm(blankForm());
    setImageFile(null);
    setImagePreview("");
    setError(null);
    setMessage("");
  };

  const handleDeletePost = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteBlogPost(deleteConfirm);
      const remaining = posts.filter((p) => p._id !== deleteConfirm);
      setPosts(remaining);
      if (editingPostId === deleteConfirm) {
        if (remaining.length > 0) {
          selectPost(remaining[0]);
        } else {
          setEditingPostId(null);
          setEditorForm(null);
        }
      }
      setMessage("Blog post deleted successfully.");
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete blog post.");
      setDeleteConfirm(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const updateField = (field, value) =>
    setEditorForm((f) => ({ ...f, [field]: value }));

  const handleTagsChange = (value) => {
    updateField(
      "tags",
      value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  };

  const commitPost = async (status) => {
    if (!editorForm) return;
    if (!editorForm.title || !editorForm.content) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = createBlogFormData(
        { ...editorForm, status },
        imageFile
      );

      const isNew = editingPostId === NEW_POST_ID;
      let savedPost;

      if (isNew) {
        const res = await createBlogPost(payload);
        savedPost = res.post;
        setPosts([savedPost, ...posts]);
      } else {
        const res = await updateBlogPost(editingPostId, payload);
        savedPost = res.post;
        setPosts((prev) =>
          prev.map((p) => (p._id === savedPost._id ? savedPost : p))
        );
      }

      setEditingPostId(savedPost._id);
      setEditorForm(hydrateForm(savedPost));
      setImageFile(null);
      setImagePreview(savedPost.featuredImage || "");
      setMessage(
        status === "Published"
          ? "🎉 Published successfully!"
          : "✓ Draft saved."
      );
    } catch (err) {
      setError(err.message || "Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#244c21]">Blog Management</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage blog posts</p>
          </div>
          <Button
            type="button"
            onClick={handleNewPost}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            New Post
          </Button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" color="currentColor" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="mb-6 p-4 rounded-xl border border-green-300 bg-green-50 text-green-800 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" color="currentColor" />
          <span>{message}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* POSTS LIST SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-xl font-bold text-[#244c21] mb-4 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-600 rounded-full"></span>
              Posts ({filteredPosts.length})
            </h2>
            
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* NEW POST INDICATOR */}
              {editingPostId === NEW_POST_ID && (
                <div className="p-4 rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    New Post (unsaved)
                  </p>
                </div>
              )}

              {/* POSTS LIST */}
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No posts found</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => selectPost(post)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      editingPostId === post._id
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500 shadow-md"
                        : "bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-md"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 truncate text-sm">{post.title || "Untitled"}</h4>
                    <p className="text-xs text-gray-500 mt-1">{post.author || "No author"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={post.status === "Published" ? "active" : "pending"}>
                        {post.status}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post._id);
                      }}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* EDITOR SECTION */}
        <div className="lg:col-span-2">
          {editorForm ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* HEADER */}
              <div className="px-8 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 shadow-sm">
                  <FileText size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[#244c21]">
                  {editingPostId === NEW_POST_ID ? "Create New Post" : "Edit Post"}
                </h2>
              </div>

              {/* CONTENT */}
              <div className="p-8 space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* TITLE & CATEGORY ROW */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
                    <input
                      type="text"
                      value={editorForm.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Enter an engaging title..."
                    />
                  </div>
                </div>

                {/* CATEGORY & STATUS */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                    <select
                      value={editorForm.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                    <select
                      value={editorForm.status}
                      onChange={(e) => updateField("status", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                {/* AUTHOR */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Author *</label>
                  <input
                    type="text"
                    value={editorForm.author}
                    onChange={(e) => updateField("author", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Author name"
                  />
                </div>

                {/* EXCERPT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
                  <textarea
                    value={editorForm.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors resize-none"
                    placeholder="Brief summary (shown in listings)..."
                  />
                </div>

                {/* FEATURED IMAGE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Featured Image</label>
                  {imagePreview && (
                    <div className="mb-4 relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 rounded-xl object-cover border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpg,image/jpeg,image/png"
                    id="featured-image-upload"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="featured-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-dashed border-gray-300 hover:border-green-500 cursor-pointer transition-all text-sm font-semibold text-gray-700"
                  >
                    <Upload size={18} />
                    {imageFile ? `Change Image (${imageFile.name})` : "Upload Image"}
                  </label>
                </div>

                {/* CONTENT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Content *</label>
                  <textarea
                    value={editorForm.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    rows={14}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors font-mono text-sm leading-7"
                    placeholder="Write your blog content here..."
                  />
                </div>

                {/* TAGS */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
                  <input
                    type="text"
                    value={editorForm.tags.join(", ")}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="e.g. recycling, tips, sustainability (comma-separated)"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3 border-t-2 border-gray-100 p-8 bg-gray-50">
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => commitPost("Draft")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {loading ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => commitPost("Published")}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  {loading ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white border-2 border-dashed border-gray-300">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-semibold">
                {loading ? "Loading your posts..." : "Create a new post to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-6 py-6 border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-red-100/50">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Post?</h3>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to permanently delete this blog post? This cannot be recovered.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-t-2 border-gray-100">
              <Button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                variant="danger"
                fullWidth
                className="flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
