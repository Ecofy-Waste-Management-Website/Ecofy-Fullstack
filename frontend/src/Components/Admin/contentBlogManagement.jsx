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

const categories = [
  "All",
  "Recycling Tips",
  "Community Events",
  "Eco-Guides",
];

const Icons = {
  Plus: () => (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ),
};

export default function ContentBlogManagement() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = () => {
      const storedPosts = getArticles();

      setPosts(storedPosts);

      setEditingPostId(
        (current) => current || storedPosts[0]?.id || null
      );
    };

    loadArticles();

    window.addEventListener(
      "ecofy-articles-updated",
      loadArticles
    );

    return () =>
      window.removeEventListener(
        "ecofy-articles-updated",
        loadArticles
      );
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
        post.title
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        post.author
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  }, [posts, searchText]);

  const editingPost = posts.find(
    (p) => p.id === editingPostId
  );

  const handleCreateNewPost = () => {
    const next = createArticle({
      title: "Untitled Article",
      category: "Recycling Tips",
      author: "M.N. Mohamed",
      status: "Draft",
      thumbnail: "bottle",
      excerpt: "",
      content: "",
      featuredImage: "",
      comments: 0,
    });

    refreshPosts(next);

    setEditingPostId(next[0]?.id || null);
  };

  const updateEditingPostField = (field, value) => {
    if (!editingPost) return;

    refreshPosts(
      updateArticle(editingPost.id, {
        [field]: value,
      })
    );
  };

  return (
    <section className="w-full font-sans text-[#244c21]">

      {/* TOP BAR */}
      <div className="mb-6 flex justify-between">

        <input
          className="border px-3 py-2 rounded-lg"
          placeholder="Search..."
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
        />

        <button
          onClick={handleCreateNewPost}
          className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Icons.Plus />
          New Post
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row items-start">

        {/* POSTS LIST */}
        <section className="flex w-full flex-col gap-4 lg:w-1/3">

          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setEditingPostId(post.id)}
              className={`p-4 border rounded-xl cursor-pointer transition ${
                editingPostId === post.id
                  ? "bg-green-100"
                  : "bg-white"
              }`}
            >
              <h4 className="font-bold">
                {post.title}
              </h4>

              <p className="text-xs mt-1">
                {post.author}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePost(post.id);
                }}
                className="mt-3 text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </section>

        {/* EDITOR */}
        <div className="w-full lg:w-2/3">

          {editingPost ? (
            <div className="border rounded-2xl bg-white overflow-hidden">

              {/* HEADER */}
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">
                  Edit Article
                </h2>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-6">

                {/* TITLE */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Title
                  </label>

                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) =>
                      updateEditingPostField(
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                {/* IMAGE PREVIEW */}
                {editingPost.featuredImage && (
                  <div>
                    <img
                      src={editingPost.featuredImage}
                      alt="Preview"
                      className="h-64 w-full rounded-xl object-cover border"
                    />
                  </div>
                )}

                {/* CONTENT EDITOR */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Content
                  </label>

             <ReactQuill
  theme="snow"
  value={editingPost.content || ""}
  onChange={(val) =>
    updateEditingPostField("content", val)
  }
  style={{ height: "400px" }}
  modules={{
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  }}
  formats={[
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
  ]}
/>
                </div>

                <div className="h-16"></div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-between border-t p-4">

                {/* IMAGE BUTTON */}
                <div>

                  <input
                    type="file"
                    accept="image/*"
                    id="featured-image-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (!file) return;

                      const reader = new FileReader();

                      reader.onloadend = () => {
                        updateEditingPostField(
                          "featuredImage",
                          reader.result
                        );
                      };

                      reader.readAsDataURL(file);
                    }}
                  />

                  <label
                    htmlFor="featured-image-upload"
                    className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                  >
                    Upload Image
                  </label>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      handleSaveDraft(editingPost.id)
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    Save Draft
                  </button>

                  <button
                    onClick={() =>
                      handlePublishPost(editingPost.id)
                    }
                    className="px-4 py-2 bg-green-700 text-white rounded-lg"
                  >
                    Publish
                  </button>

                </div>
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