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
        setMessage("🎉 Published successfully! Opening new post form...");
        setTimeout(() => {
          handleNewPost();
        }, 1500);
      } else {
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

  return (
    <section className="space-y-6 text-[#244c21]">

      {/* ── HEADER ── */}
      <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="m-0 text-2xl font-black tracking-tight text-[#244c21]">Blog Management</h3>
            <p className="m-0 mt-1 text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest">Create, edit, and publish blog posts</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 p-4 shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mb-1">Total</p>
              <p className="m-0 text-xl font-black text-[#244c21]">{posts.length}</p>
            </div>
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 p-4 shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/80 uppercase tracking-widest mb-1">Published</p>
              <p className="m-0 text-xl font-black text-[#397239]">{posts.filter((p) => p.status === "Published").length}</p>
            </div>
            <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 p-4 shadow-sm">
              <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mb-1">Drafts</p>
              <p className="m-0 text-xl font-black text-[#244c21]">{posts.filter((p) => p.status === "Draft").length}</p>
            </div>
          </div>
        </div>

        {/* Search + New Post */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#397239]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter by title or author..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/40"
            />
          </div>
          <button
            type="button"
            onClick={handleNewPost}
            className="rounded-xl bg-[#397239] px-6 py-3 text-xs font-black text-white transition-all hover:scale-105 active:scale-95 shadow-md uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* ── ALERTS ── */}
      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-xs font-bold text-red-500 shadow-sm flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/80 px-5 py-4 text-xs font-bold text-[#397239] shadow-sm flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#397239] flex-shrink-0" />
          {message}
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── POSTS LIST ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#397234]/10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#397239]" />
              <p className="m-0 text-[10px] font-black uppercase tracking-widest text-[#244c21]">
                Posts ({filteredPosts.length})
              </p>
            </div>

            <div className="divide-y divide-[#397239]/10 max-h-[calc(100vh-260px)] overflow-y-auto">
              {/* New post indicator */}
              {editingPostId === NEW_POST_ID && (
                <div className="px-5 py-4 bg-[#397239]/10">
                  <p className="m-0 text-[10px] font-black text-[#397239] uppercase tracking-widest flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#397239] animate-pulse" />
                    New Post — unsaved
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 gap-3">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#397239] border-t-transparent" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/40">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="h-10 w-10 mx-auto text-[#397239]/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/30">No posts found</p>
                </div>
              ) : filteredPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => selectPost(post)}
                  className={`px-5 py-4 cursor-pointer transition-all group ${
                    editingPostId === post._id
                      ? "bg-[#397239]/10"
                      : "hover:bg-[#397239]/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="m-0 text-sm font-black text-[#244c21] truncate group-hover:text-[#397239] transition-colors">
                        {post.title || "Untitled"}
                      </h4>
                      <p className="m-0 mt-0.5 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest">{post.author || "No author"}</p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${
                      post.status === "Published"
                        ? "bg-[#397239]/15 text-[#397239]"
                        : "bg-[#112A0F]/8 text-[#244c21]/60"
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 pt-2 border-t border-[#397239]/10">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); selectPost(post); }}
                      className="text-[10px] font-extrabold text-[#397239] hover:text-[#244c21] uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                      Edit
                    </button>
                    <span className="text-[#397239]/20 text-xs">|</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id); }}
                      className="text-[10px] font-extrabold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] shadow-sm overflow-hidden">

              {/* Editor header */}
              <div className="px-6 py-5 border-b border-[#397234]/10 flex items-center gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-2xl bg-[#397239]/15 flex items-center justify-center text-[#397239]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="m-0 text-lg font-black text-[#244c21]">
                    {editingPostId === NEW_POST_ID ? "Create New Post" : "Edit Post"}
                  </h4>
                  <p className="m-0 text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest mt-0.5">
                    {editingPostId === NEW_POST_ID ? "Fill in the fields below to create a new post" : "Editing existing post"}
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto">

                <div>
                  <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Post Title *</label>
                  <input
                    type="text"
                    value={editorForm.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/40"
                    placeholder="Enter an engaging title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Category *</label>
                    <select
                      value={editorForm.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] transition-all cursor-pointer"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Status</label>
                    <select
                      value={editorForm.status}
                      onChange={(e) => updateField("status", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] transition-all cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Author *</label>
                  <input
                    type="text"
                    value={editorForm.author}
                    onChange={(e) => updateField("author", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/40"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Excerpt</label>
                  <textarea
                    value={editorForm.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] focus:bg-white transition-all resize-none placeholder:text-[#397239]/40 leading-relaxed"
                    placeholder="Brief summary shown in post listings..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Featured Image</label>
                  {imagePreview && (
                    <div className="mb-3 relative group rounded-2xl overflow-hidden border border-[#397234]/20">
                      <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => { setImagePreview(""); setImageFile(null); }}
                          className="bg-white text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <input type="file" accept="image/jpg,image/jpeg,image/png" id="featured-image-upload" className="hidden" onChange={handleImageChange} />
                  <label
                    htmlFor="featured-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#397234]/30 bg-[#D6E9CA]/30 hover:border-[#397239] hover:bg-[#D6E9CA]/60 cursor-pointer transition-all text-xs font-extrabold text-[#397239] uppercase tracking-widest"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imageFile ? `Change Image (${imageFile.name})` : "Upload Image"}
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Content *</label>
                  <textarea
                    value={editorForm.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    rows={14}
                    className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] focus:bg-white transition-all font-mono leading-7 placeholder:text-[#397239]/40"
                    placeholder="Write your blog content here..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#244c21] uppercase tracking-widest mb-2">Tags</label>
                  <input
                    type="text"
                    value={editorForm.tags.join(", ")}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 text-sm text-[#244c21] font-medium outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/40"
                    placeholder="recycling, tips, sustainability (comma-separated)"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#397234]/10 p-5 bg-[#D6E9CA]/30">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => commitPost("Draft")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#397234]/20 bg-white text-xs font-black text-[#244c21] hover:bg-[#D6E9CA]/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {loading ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => commitPost("Published")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#397239] text-xs font-black text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md uppercase tracking-widest"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 rounded-3xl border border-dashed border-[#397234]/30 bg-[#D6E9CA]/30">
              <svg className="h-14 w-14 text-[#397239]/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/40">
                {loading ? "Loading your posts..." : "Create a new post to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-[#397234]/10">
            <div className="px-6 py-6 border-b border-red-100 bg-red-50/50">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-2xl bg-red-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="m-0 text-sm font-black text-[#244c21] uppercase tracking-widest">Delete Post?</h3>
                  <p className="m-0 mt-1 text-[10px] font-bold text-red-400 uppercase tracking-widest">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-[#244c21] font-medium leading-relaxed">Are you sure you want to permanently delete this blog post?</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-[#D6E9CA]/30 border-t border-[#397234]/10">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-[#397234]/20 text-xs font-black text-[#244c21] hover:bg-[#D6E9CA]/60 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-xs font-black text-white hover:bg-red-600 transition-all shadow-md uppercase tracking-widest"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}