import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [editorForm, setEditorForm] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const hydrateEditorForm = (post) => {
    if (!post) return null;

    return {
      title: post.title || "",
      category: post.category || "Recycling Tips",
      author: post.author || "Admin",
      thumbnail: post.thumbnail || "bottle",
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: post.featuredImage || "",
      comments: post.comments || 0,
    };
  };

  useEffect(() => {
    const loadArticles = () => {
      const storedPosts = getArticles();

      setPosts(storedPosts);

      const nextSelectedId =
        editingPostId || storedPosts[0]?.id || null;

      setEditingPostId(nextSelectedId);
      setEditorForm(hydrateEditorForm(
        storedPosts.find((post) => post.id === nextSelectedId) || storedPosts[0] || null
      ));
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
  }, [editingPostId]);

  const refreshPosts = (next) => setPosts(next);

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

  useEffect(() => {
    setEditorForm(hydrateEditorForm(editingPost));
  }, [editingPostId, editingPost]);

  const commitPost = (status) => {
    if (!editingPost || !editorForm) return;

    const normalizedStatus = status === "Published" ? "Published" : "Draft";

    const nextPosts = updateArticle(editingPost.id, {
      ...editorForm,
      status: normalizedStatus,
      publishedAt: normalizedStatus === "Published" ? new Date().toISOString() : null,
    });

    refreshPosts(nextPosts);
    setError(null);
    setMessage(
      normalizedStatus === "Published"
        ? "Published successfully. Redirecting to the blog page."
        : "Draft saved successfully."
    );

    if (normalizedStatus === "Published") {
      navigate("/blogs");
    }
  };

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
    setEditorForm(hydrateEditorForm(next[0] || null));
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
          type="button"
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

      {message && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#397239]">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row items-start">

        {/* POSTS LIST */}
        <section className="flex w-full flex-col gap-4 lg:w-1/3">

          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                setEditingPostId(post.id);
                setEditorForm(hydrateEditorForm(post));
              }}
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
                type="button"
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
                    value={editorForm?.title || ""}
                    onChange={(e) =>
                      setEditorForm((current) => ({
                        ...(current || hydrateEditorForm(editingPost)),
                        title: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                {/* IMAGE PREVIEW */}
                {editorForm?.featuredImage && (
                  <div>
                    <img
                      src={editorForm.featuredImage}
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

                  <textarea
                    value={editorForm?.content || ""}
                    onChange={(e) =>
                      setEditorForm((current) => ({
                        ...(current || hydrateEditorForm(editingPost)),
                        content: e.target.value,
                      }))
                    }
                    placeholder="Write the article content here..."
                    className="min-h-[400px] w-full rounded-lg border px-4 py-3 leading-7 outline-none focus:border-green-600"
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
                        setEditorForm((current) => ({
                          ...(current || hydrateEditorForm(editingPost)),
                          featuredImage: reader.result,
                        }));
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
                    type="button"
                    onClick={() =>
                      commitPost("Draft")
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      commitPost("Published")
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