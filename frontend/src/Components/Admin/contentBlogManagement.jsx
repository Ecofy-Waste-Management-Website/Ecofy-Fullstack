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
<<<<<<< HEAD
<<<<<<< HEAD
  bottle: "\ud83e\uddf4",
  cleanup: "\ud83e\uddd1\u200d\ud83e\uddf9",
  compost: "\ud83c\udf31",
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
  bottle: "🧴",
  cleanup: "🧑‍🧹",
  compost: "🌱",
};

const thumbnailStyles = {
  bottle: "bg-blue-100 text-blue-600",
  cleanup: "bg-amber-100 text-amber-600",
  compost: "bg-green-100 text-green-600",
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
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

  const editingPost =
    initialPosts.find((post) => post.id === editingPostId) || filteredPosts[0];

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <section className="cbm-shell">
      <header className="cbm-header">
        <h3>Ecofy Content &amp; Blog Management</h3>
      </header>

      <div className="cbm-controls-grid">
        <div className="cbm-filters">
          <div className="cbm-filter-block">
            <p>Search and Filter Bar</p>
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
    <section className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Ecofy Content &amp; Blog Management
        </h3>
      </header>

      <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-600">
              Search and Filter Bar
            </p>
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search for requests or staff"
<<<<<<< HEAD
<<<<<<< HEAD
            />
          </div>

          <div className="cbm-filter-block">
            <p>Category</p>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:w-64"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-600">Category</p>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          <div className="cbm-filter-block cbm-status-toggle">
            <p>Status</p>
            <div className="cbm-toggle-row">
              <button
                type="button"
                className={selectedStatus === "All" ? "active" : ""}
                onClick={() => setSelectedStatus("All")}
              >
                All
              </button>
              <button
                type="button"
                className={selectedStatus === "Published" ? "active" : ""}
                onClick={() => setSelectedStatus("Published")}
              >
                Published
              </button>
              <button
                type="button"
                className={selectedStatus === "Draft" ? "active" : ""}
                onClick={() => setSelectedStatus("Draft")}
              >
                Draft
              </button>
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-600">Status</p>
            <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
              {["All", "Published", "Draft"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${status !== "All" ? "border-l border-gray-300" : ""}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
            </div>
          </div>
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
        <button type="button" className="cbm-create-post-btn">
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
        <button
          type="button"
          className="whitespace-nowrap rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
          + Create New Post
        </button>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      <div className="cbm-layout-grid">
        <section className="cbm-post-list" aria-label="Blog posts list">
          {filteredPosts.map((post) => (
            <article key={post.id} className="cbm-post-card">
              <div className={`cbm-thumb ${post.thumbnail}`}>
                <span>{previewByThumbnail[post.thumbnail]}</span>
              </div>

              <div className="cbm-post-meta">
                <h4>{post.title}</h4>
                <p className="cbm-subline">
                  <span>{post.category}</span>
                  <span>{post.author}</span>
                </p>
                <p className="cbm-status-line">
                  <span
                    className={`cbm-status-pill ${
                      post.status === "Published" ? "published" : "draft"
                    }`}
                  >
                    {post.status}
                  </span>
                  <span>Comments: {post.comments}</span>
                </p>
                <div className="cbm-post-actions">
                  <button type="button" onClick={() => setEditingPostId(post.id)}>
                    Edit
                  </button>
                  {post.status === "Published" ? (
                    <button type="button" className="danger">
                      Delete
                    </button>
                  ) : (
                    <button type="button" className="publish">
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Post List */}
        <section
          className="flex w-full flex-col gap-4 lg:w-1/3"
          aria-label="Blog posts list"
        >
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className={`flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row ${
                editingPostId === post.id ? "border-green-500 ring-1 ring-green-500" : "border-gray-200"
              }`}
            >
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-3xl ${
                  thumbnailStyles[post.thumbnail]
                }`}
              >
                <span>{previewByThumbnail[post.thumbnail]}</span>
              </div>

              <div className="flex flex-1 flex-col">
                <h4 className="text-base font-semibold text-gray-900 leading-tight mb-1">
                  {post.title}
                </h4>
                <p className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>{post.category}</span>
                  <span className="font-medium">{post.author}</span>
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-medium ${
                        post.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-gray-500">
                      💬 {post.comments}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingPostId(post.id)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  {post.status === "Published" ? (
                    <button
                      type="button"
                      className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-50"
                    >
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
<<<<<<< HEAD
<<<<<<< HEAD
        </section>

        <aside className="cbm-editor">
          {editingPost ? (
            <>
              <div className="cbm-editor-head">
                <h4>Edit Post: {editingPost.title}</h4>
                <button type="button">x</button>
              </div>

              <div className="cbm-editor-grid">
                <div className="cbm-editor-body">
                  <div className="cbm-toolbar">
                    <span>B</span>
                    <span>I</span>
                    <span>List</span>
                    <span>Link</span>
                  </div>
                  <textarea
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
          {filteredPosts.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No posts found matching your filters.
            </div>
          )}
        </section>

        {/* Editor Aside */}
        <aside className="w-full lg:w-2/3">
          {editingPost ? (
            <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4">
                <h4 className="text-lg font-bold text-gray-900">
                  Edit Post: <span className="font-medium text-gray-600">{editingPost.title}</span>
                </h4>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
                  aria-label="Close editor"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-6 p-6 lg:flex-row">
                <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-300">
                  <div className="flex gap-2 border-b border-gray-300 bg-gray-50 p-2">
                    {["B", "I", "List", "Link"].map((tool) => (
                      <button
                        key={tool}
                        className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                  <textarea
<<<<<<< HEAD
                    className="min-h-[300px] w-full resize-y p-4 text-sm text-gray-800 focus:outline-none"
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
                    className="min-h-[75px] w-full resize-y p-4 text-sm text-gray-800 focus:outline-none"
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis aute exercitation laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </div>

<<<<<<< HEAD
<<<<<<< HEAD
                <div className="cbm-editor-form">
                  <label>
                    Post Title
                    <input type="text" defaultValue={editingPost.title} />
                  </label>
                  <label>
                    Category
                    <select defaultValue={editingPost.category}>
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
                <div className="flex w-full flex-col gap-5 lg:w-64 shrink-0">
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                    Post Title
                    <input
                      type="text"
                      defaultValue={editingPost.title}
                      className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                    Category
                    <select
                      defaultValue={editingPost.category}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
                      {categories
                        .filter((category) => category !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </label>
<<<<<<< HEAD
<<<<<<< HEAD
                  <label>
                    Author
                    <input type="text" defaultValue={editingPost.author} />
                  </label>
                  <label>
                    Tags
                    <input type="text" defaultValue="# tags" />
                  </label>
                  <label>
                    Featured Image
                    <button type="button" className="cbm-upload-btn">
                      Upload image
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                    Author
                    <input
                      type="text"
                      defaultValue={editingPost.author}
                      className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                    Tags
                    <input
                      type="text"
                      defaultValue="# tags"
                      className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                    Featured Image
                    <button
                      type="button"
                      className="mt-1 w-full rounded-md border-2 border-dashed border-gray-300 py-6 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50"
                    >
                      + Upload image
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
                    </button>
                  </label>
                </div>
              </div>

<<<<<<< HEAD
<<<<<<< HEAD
              <div className="cbm-editor-actions">
                <button type="button">Save as Draft</button>
                <button type="button" className="primary">
                  Publish Now
                </button>
              </div>
            </>
          ) : (
            <p className="cbm-empty">No post selected for editing.</p>
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
              <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                >
                  Publish Now
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-500">
              <p>No post selected for editing.</p>
            </div>
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
          )}
        </aside>
      </div>
    </section>
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
}
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
