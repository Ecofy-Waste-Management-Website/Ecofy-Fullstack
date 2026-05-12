import React, { useEffect, useMemo, useState } from "react";
import { createArticle, deleteArticle, getArticles, setArticleStatus, updateArticle } from "../../services/articleStore";

const categories = ["All", "Recycling Tips", "Community Events", "Eco-Guides"];

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Bottle: () => (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Cleanup: () => (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Compost: () => (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Comments: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  Close: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Plus: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )
};

const previewByThumbnail = {
  bottle: <Icons.Bottle />,
  cleanup: <Icons.Cleanup />,
  compost: <Icons.Compost />,
};

const thumbnailStyles = {
  bottle: "bg-blue-100 text-blue-600",
  cleanup: "bg-amber-100 text-amber-600",
  compost: "bg-green-100 text-[#66c45e]",
};

export default function ContentBlogManagement() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    const loadArticles = () => {
      const storedPosts = getArticles();
      setPosts(storedPosts);
      setEditingPostId((currentPostId) => currentPostId || storedPosts[0]?.id || null);
    };

    loadArticles();

    const handleStoreUpdate = () => loadArticles();
    window.addEventListener("ecofy-articles-updated", handleStoreUpdate);

    return () => {
      window.removeEventListener("ecofy-articles-updated", handleStoreUpdate);
    };
  }, []);

  const refreshPosts = (nextPosts) => {
    setPosts(nextPosts);
    if (!editingPostId && nextPosts.length > 0) {
      setEditingPostId(nextPosts[0].id);
    }
  };

  const handlePublishPost = (postId) => {
    refreshPosts(setArticleStatus(postId, "Published"));
  };

  const handleSaveDraft = (postId) => {
    refreshPosts(setArticleStatus(postId, "Draft"));
  };

  const handleDeletePost = (postId) => {
    const nextPosts = deleteArticle(postId);
    refreshPosts(nextPosts);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.author.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "All" || post.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchText, selectedCategory, selectedStatus]);

  const editingPost = posts.find((post) => post.id === editingPostId);

  const handleCreateNewPost = () => {
    const nextPosts = createArticle({
      title: "Untitled Article",
      category: "Recycling Tips",
      author: "M.N. Mohamed",
      status: "Draft",
      thumbnail: "bottle",
      excerpt: "Start drafting your new eco article.",
      comments: 0,
    });

    refreshPosts(nextPosts);
    setEditingPostId(nextPosts[0]?.id || null);
  };

  const updateEditingPostField = (field, value) => {
    if (!editingPost) return;
    const nextPosts = updateArticle(editingPost.id, { [field]: value });
    refreshPosts(nextPosts);
  };

  return (
    <section className="w-full font-sans text-white">
      
      {/* Top Controls */}
      <div className="mb-6 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[50px] p-6 shadow-xl">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Search Content</label>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Titles or authors..."
              className="w-full sm:w-64 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Filter Category</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-[#244c21]">{category}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Post Status</label>
            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black/20 p-1">
              {["All", "Published", "Draft"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg ${
                    selectedStatus === status
                      ? "bg-[#66c45e] text-[#051F10] shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateNewPost}
          className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#66c45e] px-6 py-3 text-sm font-extrabold text-[#051F10] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#66c45e]/20"
        >
          <Icons.Plus /> Create New Post
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row items-start">
        
        {/* Post List */}
        <section className="flex w-full flex-col gap-4 lg:w-1/3" aria-label="Blog posts list">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className={`flex flex-col gap-5 rounded-2xl border transition-all cursor-pointer group backdrop-blur-[50px] p-5 ${
                editingPostId === post.id 
                  ? "bg-white/10 border-[#66c45e] shadow-xl shadow-[#66c45e]/5" 
                  : "bg-white/5 border-white/10 hover:border-white/30"
              }`}
              onClick={() => setEditingPostId(post.id)}
            >
              <div className="flex gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10 shadow-inner`}>
                  <div className={thumbnailStyles[post.thumbnail].split(' ')[1]}>
                    {previewByThumbnail[post.thumbnail]}
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <h4 className="mb-1 text-base font-extrabold text-white leading-tight group-hover:text-[#66c45e] transition-colors">
                    {post.title}
                  </h4>
                  <p className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span>{post.category}</span>
                    <span className="text-[#66c45e]">{post.author}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${
                      post.status === "Published" ? "bg-green-400/20 text-green-400" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {post.status}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase"><Icons.Comments /> {post.comments}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingPostId(post.id); }}
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Edit
                  </button>
                  {post.status === "Published" ? (
                    <button
                      type="button"
                      className="rounded-lg bg-red-400/10 border border-red-400/20 px-3 py-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:bg-red-400/20 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePublishPost(post.id);
                      }}
                      className="rounded-lg bg-[#66c45e]/10 border border-[#66c45e]/20 px-3 py-1.5 text-[10px] font-bold text-[#66c45e] uppercase tracking-widest hover:bg-[#66c45e]/20 transition-all"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-10 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
              No matching content found
            </div>
          )}
        </section>

        {/* Editor Aside */}
        <aside className="w-full lg:w-2/3 lg:sticky lg:top-4">
          {editingPost ? (
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-[50px] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                <h4 className="text-lg font-extrabold text-white">
                  Editor: <span className="text-[#66c45e]">{editingPost.title}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingPostId(null)}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                >
                  <Icons.Close />
                </button>
              </div>

              <div className="flex flex-col gap-8 p-8 lg:flex-row">
                {/* Text Editor Area */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-inner">
                  <div className="flex gap-2 border-b border-white/10 bg-white/5 p-3">
                    {["B", "I", "List", "Link"].map((tool) => (
                      <button
                        key={tool}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="min-h-[400px] w-full resize-y bg-transparent p-6 text-sm text-white/90 outline-none placeholder:text-white/20 leading-relaxed"
                    value={editingPost.excerpt || ""}
                    placeholder="Start writing your article content here..."
                    onChange={(event) => updateEditingPostField("excerpt", event.target.value)}
                  />
                </div>

                {/* Sidebar Settings */}
                <div className="flex w-full shrink-0 flex-col gap-6 lg:w-72">
                  <div className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Article Title</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(event) => updateEditingPostField("title", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Category</label>
                      <select
                        value={editingPost.category}
                        onChange={(event) => updateEditingPostField("category", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all cursor-pointer"
                      >
                        {categories.filter((c) => c !== "All").map((category) => (
                          <option key={category} value={category} className="bg-[#244c21]">{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Author Name</label>
                      <input
                        type="text"
                        value={editingPost.author}
                        onChange={(event) => updateEditingPostField("author", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Keywords / Tags</label>
                      <input
                        type="text"
                        value={editingPost.tags || "#eco #community"}
                        onChange={(event) => updateEditingPostField("tags", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-[#66c45e] font-mono outline-none focus:border-[#66c45e] transition-all"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Cover Image</label>
                      <button
                        type="button"
                        className="w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-10 text-[10px] font-extrabold text-[#66c45e] transition-all hover:border-[#66c45e] hover:bg-[#66c45e]/5 uppercase tracking-widest"
                      >
                        + Upload Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 border-t border-white/10 bg-white/5 px-8 py-6">
                <button
                  type="button"
                  onClick={() => handleSaveDraft(editingPost.id)}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-extrabold text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handlePublishPost(editingPost.id)}
                  className="rounded-xl bg-[#66c45e] px-8 py-3 text-xs font-extrabold text-[#051F10] shadow-lg shadow-[#66c45e]/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                >
                  Publish Now
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 text-white/20 shadow-2xl">
              <Icons.Plus />
              <p className="mt-4 font-bold uppercase tracking-widest text-[10px]">Select a post to edit</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}