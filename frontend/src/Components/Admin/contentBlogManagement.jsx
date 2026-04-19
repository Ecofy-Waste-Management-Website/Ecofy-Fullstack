import React, { useMemo, useState } from "react";

const categories = ["All", "Recycling Tips", "Community Events", "Eco-Guides"];

const initialPosts = [
  {
    id: 1,
    title: "5 Tips for Reducing Home Plastic",
    category: "Recycling Tips",
    author: "M.N. Mohamed",
    comments: 12,
    status: "Published",
    thumbnail: "bottle",
  },
  {
    id: 2,
    title: "Upcoming Beach Cleanup Drive",
    category: "Community Events",
    author: "Guest Contributor",
    comments: 0,
    status: "Draft",
    thumbnail: "cleanup",
  },
  {
    id: 3,
    title: "Composting 101: A Beginner's Guide",
    category: "Eco-Guides",
    author: "M.N. Mohamed",
    comments: 5,
    status: "Published",
    thumbnail: "compost",
  },
];

const previewByThumbnail = {
  bottle: "🧴",
  cleanup: "🧑‍🧹",
  compost: "🌱",
};

const thumbnailStyles = {
  bottle: "bg-blue-100 text-blue-600",
  cleanup: "bg-amber-100 text-amber-600",
  compost: "bg-green-100 text-green-600",
};

export default function ContentBlogManagement() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Recycling Tips");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingPostId, setEditingPostId] = useState(initialPosts[0].id);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.author.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "All" || post.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchText, selectedCategory, selectedStatus]);

  const editingPost = initialPosts.find((post) => post.id === editingPostId);

  return (
    <section className="w-full font-sans text-[#0f1d33]">
      
      {/* Top Controls */}
      <div className="mb-6 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Search</label>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search posts or authors..."
              className="w-full sm:w-64 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Category</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
              {["All", "Published", "Draft"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? "bg-[#0f5cbd] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  } ${status !== "All" ? "border-l border-gray-300" : ""}`}
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
          className="whitespace-nowrap rounded-lg bg-[#0f5cbd] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0b4899] focus:outline-none focus:ring-2 focus:ring-[#0f5cbd]/40 focus:ring-offset-1"
        >
          + Create New Post
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row items-start">
        
        {/* Post List */}
        <section className="flex w-full flex-col gap-3 lg:w-1/3" aria-label="Blog posts list">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className={`flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row cursor-pointer ${
                editingPostId === post.id ? "border-[#0f5cbd] ring-1 ring-[#0f5cbd]" : "border-gray-200"
              }`}
              onClick={() => setEditingPostId(post.id)}
            >
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-3xl ${thumbnailStyles[post.thumbnail]}`}>
                <span>{previewByThumbnail[post.thumbnail]}</span>
              </div>

              <div className="flex flex-1 flex-col">
                <h4 className="mb-1 text-base font-bold text-[#0f1d33] leading-tight">
                  {post.title}
                </h4>
                <p className="mb-3 flex justify-between text-xs text-gray-500">
                  <span>{post.category}</span>
                  <span className="font-medium">{post.author}</span>
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`rounded-full px-2.5 py-0.5 font-bold ${
                        post.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-gray-500 font-medium">💬 {post.comments}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingPostId(post.id); }}
                    className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  {post.status === "Published" ? (
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition-colors hover:bg-green-100"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No posts found matching your filters.
            </div>
          )}
        </section>

        {/* Editor Aside */}
        <aside className="w-full lg:w-2/3 lg:sticky lg:top-4">
          {editingPost ? (
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
                <h4 className="text-lg font-bold text-[#0f1d33]">
                  Edit Post: <span className="font-medium text-gray-600">{editingPost.title}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingPostId(null)} // Added functionality to close editor
                  className="grid h-8 w-8 place-items-center rounded-md text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
                  aria-label="Close editor"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-6 p-6 lg:flex-row">
                {/* Text Editor Area */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-300">
                  <div className="flex gap-2 border-b border-gray-300 bg-gray-50 p-2">
                    {["B", "I", "List", "Link"].map((tool) => (
                      <button
                        key={tool}
                        className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-100"
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="min-h-[350px] w-full resize-y p-4 text-sm text-gray-800 outline-none"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis aute exercitation laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </div>

                {/* Sidebar Settings */}
                <div className="flex w-full shrink-0 flex-col gap-4 lg:w-64">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Post Title</label>
                    <input
                      type="text"
                      defaultValue={editingPost.title}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                    <select
                      defaultValue={editingPost.category}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                      {categories.filter((c) => c !== "All").map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      defaultValue={editingPost.author}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
                    <input
                      type="text"
                      defaultValue="#eco #community"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Featured Image</label>
                    <button
                      type="button"
                      className="mt-1 w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-sm font-bold text-[#0f5cbd] transition-colors hover:border-[#0f5cbd] hover:bg-blue-50"
                    >
                      + Upload Image
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#0f5cbd] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0b4899]"
                >
                  Publish Now
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-gray-500 shadow-sm">
              <p>Select a post from the list to start editing.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}