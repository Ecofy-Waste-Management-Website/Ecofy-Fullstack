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
  bottle: "\ud83e\uddf4",
  cleanup: "\ud83e\uddd1\u200d\ud83e\uddf9",
  compost: "\ud83c\udf31",
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
    <section className="cbm-shell">
      <header className="cbm-header">
        <h3>Ecofy Content &amp; Blog Management</h3>
      </header>

      <div className="cbm-controls-grid">
        <div className="cbm-filters">
          <div className="cbm-filter-block">
            <p>Search and Filter Bar</p>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search for requests or staff"
            />
          </div>

          <div className="cbm-filter-block">
            <p>Category</p>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

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
            </div>
          </div>
        </div>

        <button type="button" className="cbm-create-post-btn">
          + Create New Post
        </button>
      </div>

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
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
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
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis aute exercitation laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </div>

                <div className="cbm-editor-form">
                  <label>
                    Post Title
                    <input type="text" defaultValue={editingPost.title} />
                  </label>
                  <label>
                    Category
                    <select defaultValue={editingPost.category}>
                      {categories
                        .filter((category) => category !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </label>
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
                    </button>
                  </label>
                </div>
              </div>

              <div className="cbm-editor-actions">
                <button type="button">Save as Draft</button>
                <button type="button" className="primary">
                  Publish Now
                </button>
              </div>
            </>
          ) : (
            <p className="cbm-empty">No post selected for editing.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
