import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  createArticle,
  deleteArticle,
  getArticles,
  setArticleStatus,
  updateArticle,
} from "../../services/articleStore";

const categories = ["All", "Recycling Tips", "Community Events", "Eco-Guides"];

/* ---------------- ICONS ---------------- */
const Icons = {
  Plus: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
};

export default function ContentBlogManagement() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingPostId, setEditingPostId] = useState(null);
  // Fixed missing error state definition
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadArticles = () => {
      const storedPosts = getArticles();
      setPosts(storedPosts);
      setEditingPostId((current) => current || storedPosts[0]?.id || null);
    };

    loadArticles();
    window.addEventListener("ecofy-articles-updated", loadArticles);

    return () =>
      window.removeEventListener("ecofy-articles-updated", loadArticles);
  }, []);

  const refreshPosts = (next) => setPosts(next);

  const handlePublishPost = (id) =>
    refreshPosts(setArticleStatus(id, "Published"));

  const handleSaveDraft = (id) =>
    refreshPosts(setArticleStatus(id, "Draft"));

  const handleDeletePost = (id) =>
    refreshPosts(deleteArticle(id));

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        (post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.author.toLowerCase().includes(searchText.toLowerCase())) &&
        (selectedCategory === "All" || post.category === selectedCategory) &&
        (selectedStatus === "All" || post.status === selectedStatus)
      );
    });
  }, [posts, searchText, selectedCategory, selectedStatus]);

  const editingPost = posts.find((p) => p.id === editingPostId);

  const handleCreateNewPost = () => {
    const next = createArticle({
      title: "Untitled Article",
      category: "Recycling Tips",
      author: "M.N. Mohamed",
      status: "Draft",
      thumbnail: "bottle",
      excerpt: "",
      comments: 0,
    });

    refreshPosts(next);
    setEditingPostId(next[0]?.id || null);
  };

  const updateEditingPostField = (field, value) => {
    if (!editingPost) return;
    refreshPosts(updateArticle(editingPost.id, { [field]: value }));
  };

  return (
    <section className="w-full font-sans text-[#244c21]">

      {/* TOP BAR (simple safe version) */}
      <div className="mb-6 flex justify-between">
        <input
          className="border px-3 py-2"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          onClick={handleCreateNewPost}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          <Icons.Plus /> New Post
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row items-start">
        
        {/* Post List */}
        <section className="flex w-full flex-col gap-4 lg:w-1/3" aria-label="Blog posts list">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setEditingPostId(post.id)}
              className={`p-3 border cursor-pointer ${
                editingPostId === post.id ? "bg-green-100" : "bg-white"
              }`}
            >
              <h4 className="font-bold">{post.title}</h4>
              <p className="text-xs">{post.author}</p>

              <button onClick={() => handleDeletePost(post.id)}>
                Delete
              </button>
            </div>
          ))}
        </section> {/* Fixed: Changed from </div> to </section> */}

        {/* RIGHT EDITOR */}
        <div className="w-2/3">
          {editingPost ? (
            <div className="border rounded-xl bg-white flex flex-col">

              {/* HEADER */}
              <div className="p-4 border-b">
                <h2 className="font-bold">{editingPost.title}</h2>
              </div>

              {/* EDITOR */}
              <div className="p-4">
                <ReactQuill
                  theme="snow"
                  value={editingPost.excerpt || ""}
                  onChange={(val) =>
                    updateEditingPostField("excerpt", val)
                  }
                  style={{ height: "400px" }}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  onClick={() => handleSaveDraft(editingPost.id)}
                  className="px-4 py-2 border"
                >
                  Save Draft
                </button>

                <button
                  onClick={() => handlePublishPost(editingPost.id)}
                  className="px-4 py-2 bg-green-700 text-white"
                >
                  Publish
                </button>
              </div>

            </div>
          ) : (
            <div className="p-10 text-center">
              Select a post to edit
            </div>
          )}
        </div>
      </div>
    </section>
  );
}