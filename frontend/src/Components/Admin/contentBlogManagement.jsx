import React, { useEffect, useMemo, useState, useCallback } from "react";
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
          setImagePreview(articles[0].featuredImage || "");
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

  const selectPost = useCallback((post) => {
    setEditingPostId(post._id);
    setEditorForm(hydrateForm(post));
    setImageFile(null);
    setImagePreview(post.featuredImage || "");
    setError(null);
    setMessage("");
  }, []);

  const handleNewPost = useCallback(() => {
    setEditingPostId(NEW_POST_ID);
    setEditorForm(blankForm());
    setImageFile(null);
    setImagePreview("");
    setError(null);
    setMessage("");
  }, []);

  const handleDeletePost = (id) => setDeleteConfirm(id);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteBlogPost(deleteConfirm);
      const remaining = posts.filter((p) => p._id !== deleteConfirm);
      setPosts(remaining);
      if (editingPostId === deleteConfirm) {
        if (remaining.length > 0) selectPost(remaining[0]);
        else { setEditingPostId(null); setEditorForm(null); }
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

  const handleTagsChange = (value) =>
    updateField("tags", value.split(",").map((t) => t.trim()).filter(Boolean));

  const commitPost = async (status) => {
    if (!editorForm) return;
    if (!editorForm.title || !editorForm.content) {
      setError("Title and content are required.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const payload = createBlogFormData({ ...editorForm, status }, imageFile);
      const isNew = editingPostId === NEW_POST_ID;
      let savedPost;

      if (isNew) {
        const res = await createBlogPost(payload);
        savedPost = res.post;
        setPosts((prev) => [savedPost, ...prev]);
      } else {
        const res = await updateBlogPost(editingPostId, payload);
        savedPost = res.post;
        setPosts((prev) => prev.map((p) => (p._id === savedPost._id ? savedPost : p)));
      }

      if (status === "Published") {
        // ── Show success then auto-open blank new post form ──
        setMessage("🎉 Published successfully! Opening new post form...");
        setTimeout(() => {
          handleNewPost();
        }, 1500);
      } else {
        // Draft — stay on saved post
        setEditingPostId(savedPost._id);
        setEditorForm(hydrateForm(savedPost));
        setImageFile(null);
        setImagePreview(savedPost.featuredImage || "");
        setMessage("✓ Draft saved.");
      }
    } catch (err) {
      setError(err.message || "Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  const updateField2 = (field, value) =>
    setEditorForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#244c21]">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage blog posts</p>
        </div>
        <button type="button" onClick={handleNewPost}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 flex items-start gap-3">
          <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="mb-6 p-4 rounded-xl border border-green-300 bg-green-50 text-green-800 flex items-start gap-3">
          <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-8 relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search by title or author..." value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── POSTS LIST ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-xl font-bold text-[#244c21] mb-4 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-600 rounded-full" />
              Posts ({filteredPosts.length})
            </h2>

            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {/* New post indicator */}
              {editingPostId === NEW_POST_ID && (
                <div className="p-4 rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    New Post (unsaved)
                  </p>
                </div>
              )}

              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No posts found</p>
                </div>
              ) : filteredPosts.map((post) => (
                <div key={post._id}
                  className={`p-4 rounded-xl transition-all ${
                    editingPostId === post._id
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500 shadow-md"
                      : "bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-md"
                  }`}>

                  {/* Clickable info area */}
                  <div className="cursor-pointer" onClick={() => selectPost(post)}>
                    <h4 className="font-semibold text-gray-900 truncate text-sm">{post.title || "Untitled"}</h4>
                    <p className="text-xs text-gray-500 mt-1">{post.author || "No author"}</p>
                    <div className="mt-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        post.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); selectPost(post); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#06a63e] hover:text-[#047a2e] transition"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </button>

                    <span className="text-gray-300 text-xs">|</span>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EDITOR ── */}
        <div className="lg:col-span-2">
          {editorForm ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#244c21]">
                    {editingPostId === NEW_POST_ID ? "Create New Post" : "Edit Post"}
                  </h2>
                  {editingPostId !== NEW_POST_ID && (
                    <p className="text-xs text-gray-500 mt-0.5">Editing existing post</p>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="p-8 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
                  <input type="text" value={editorForm.title} onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Enter an engaging title..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                    <select value={editorForm.category} onChange={(e) => updateField("category", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                    <select value={editorForm.status} onChange={(e) => updateField("status", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Author *</label>
                  <input type="text" value={editorForm.author} onChange={(e) => updateField("author", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Author name" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
                  <textarea value={editorForm.excerpt} onChange={(e) => updateField("excerpt", e.target.value)}
                    rows={2} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors resize-none"
                    placeholder="Brief summary (shown in listings)..." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Featured Image</label>
                  {imagePreview && (
                    <div className="mb-4 relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 rounded-xl object-cover border-2 border-gray-200" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button type="button" onClick={() => { setImagePreview(""); setImageFile(null); }}
                          className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold">Remove</button>
                      </div>
                    </div>
                  )}
                  <input type="file" accept="image/jpg,image/jpeg,image/png" id="featured-image-upload" className="hidden" onChange={handleImageChange} />
                  <label htmlFor="featured-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 hover:border-green-500 cursor-pointer transition-all text-sm font-semibold text-gray-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imageFile ? `Change Image (${imageFile.name})` : "Upload Image"}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Content *</label>
                  <textarea value={editorForm.content} onChange={(e) => updateField("content", e.target.value)}
                    rows={14} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors font-mono text-sm leading-7"
                    placeholder="Write your blog content here..." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
                  <input type="text" value={editorForm.tags.join(", ")} onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="e.g. recycling, tips, sustainability (comma-separated)" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t-2 border-gray-100 p-6 bg-gray-50">
                <button type="button" disabled={loading} onClick={() => commitPost("Draft")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {loading ? "Saving..." : "Save Draft"}
                </button>
                <button type="button" disabled={loading} onClick={() => commitPost("Published")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white border-2 border-dashed border-gray-300">
              <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg font-semibold">
                {loading ? "Loading your posts..." : "Create a new post to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-6 border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-red-100/50">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Post?</h3>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">Are you sure you want to permanently delete this blog post?</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-t-2 border-gray-100">
              <button type="button" onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}