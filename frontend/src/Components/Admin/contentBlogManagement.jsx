import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPosts,
  updateBlogPost,
} from "../../services/api/adminService";

const categories = ["All", "Recycling Tips", "Community Events", "Eco-Guides"];

const thumbnailByCategory = {
  "Recycling Tips": { icon: "🧴", classes: "bg-blue-100 text-blue-600" },
  "Community Events": { icon: "🧑‍🧹", classes: "bg-amber-100 text-amber-600" },
  "Eco-Guides": { icon: "🌱", classes: "bg-green-100 text-green-600" },
};

const emptyDraft = {
  title: "",
  category: "Recycling Tips",
  author: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  tags: "",
  status: "Draft",
};

const getPostId = (post) => post?._id || post?.id;

const formatTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.join(", ");
  }

  return tags || "";
};

const buildPayloadFromPost = (post, nextStatus) => ({
  title: post.title || "",
  category: post.category || "Recycling Tips",
  author: post.author || "",
  excerpt: post.excerpt || "",
  content: post.content || "",
  featuredImage: post.featuredImage || "",
  tags: formatTags(post.tags),
  status: nextStatus,
});

export default function ContentBlogManagement() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const hasAutoSelectedRef = useRef(false);

  const selectedPost = useMemo(
    () => posts.find((post) => getPostId(post) === selectedPostId) || null,
    [posts, selectedPostId]
  );

  const loadPosts = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin token not found. Sign in with an admin JWT before managing posts.");
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getBlogPosts(
        {
          search: searchText,
          category: selectedCategory,
          status: selectedStatus,
          limit: 100,
        },
        token
      );

      setPosts(response.posts || []);

      const selectedStillExists =
        selectedPostId !== null &&
        response.posts?.some((post) => getPostId(post) === selectedPostId);

      if (!selectedStillExists) {
        if (!hasAutoSelectedRef.current && response.posts?.length > 0) {
          setSelectedPostId(getPostId(response.posts[0]));
          hasAutoSelectedRef.current = true;
        } else if (selectedPostId !== null) {
          const fallback = response.posts?.[0] || null;
          setSelectedPostId(getPostId(fallback));
        }
      }
    } catch (requestError) {
      setError(requestError.message || "Failed to load blog posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, selectedCategory, selectedStatus, selectedPostId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (!selectedPost) {
      setDraft(emptyDraft);
      return;
    }

    setDraft({
      title: selectedPost.title || "",
      category: selectedPost.category || "Recycling Tips",
      author: selectedPost.author || "",
      excerpt: selectedPost.excerpt || "",
      content: selectedPost.content || "",
      featuredImage: selectedPost.featuredImage || "",
      tags: formatTags(selectedPost.tags),
      status: selectedPost.status || "Draft",
    });
  }, [selectedPost]);

  const handleChange = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const persistPost = async (nextStatus) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin token not found. Sign in with an admin JWT before saving posts.");
      return;
    }

    const payload = {
      ...draft,
      status: nextStatus,
    };

    setSaving(true);
    setError("");

    try {
      if (selectedPost) {
        await updateBlogPost(getPostId(selectedPost), payload, token);
      } else {
        const created = await createBlogPost(payload, token);
        setSelectedPostId(getPostId(created.post));
      }

      await loadPosts();
    } catch (requestError) {
      setError(requestError.message || "Failed to save the blog post.");
    } finally {
      setSaving(false);
    }
  };

  const persistExistingPost = async (post, nextStatus) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin token not found. Sign in with an admin JWT before saving posts.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateBlogPost(getPostId(post), buildPayloadFromPost(post, nextStatus), token);
      await loadPosts();
    } catch (requestError) {
      setError(requestError.message || "Failed to save the blog post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin token not found. Sign in with an admin JWT before deleting posts.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await deleteBlogPost(getPostId(post), token);

      const nextPosts = posts.filter((item) => getPostId(item) !== getPostId(post));
      setPosts(nextPosts);

      const fallback = nextPosts[0] || null;
      setSelectedPostId(getPostId(fallback));
    } catch (requestError) {
      setError(requestError.message || "Failed to delete the blog post.");
    } finally {
      setSaving(false);
    }
  };

  const visiblePosts = posts;

  return (
    <section className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800 md:p-8">
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
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search posts or authors"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:w-64"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-600">Category</p>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-600">Status</p>
            <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
              {["All", "Published", "Draft"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`border-l border-gray-300 px-4 py-2 text-sm font-medium transition-colors first:border-l-0 ${
                    selectedStatus === status
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
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
          onClick={() => {
            setSelectedPostId(null);
            setDraft(emptyDraft);
          }}
          className="whitespace-nowrap rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          + Create New Post
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="flex w-full flex-col gap-4 lg:w-1/3" aria-label="Blog posts list">
          {loading ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              Loading blog posts...
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No posts found matching your filters.
            </div>
          ) : (
            visiblePosts.map((post) => {
              const postId = getPostId(post);
              const visual = thumbnailByCategory[post.category] || thumbnailByCategory["Recycling Tips"];

              return (
                <article
                  key={postId}
                  className={`flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row ${
                    selectedPostId === postId ? "border-green-500 ring-1 ring-green-500" : "border-gray-200"
                  }`}
                >
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-3xl ${visual.classes}`}>
                    <span>{visual.icon}</span>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h4 className="mb-1 text-base font-semibold leading-tight text-gray-900">
                      {post.title}
                    </h4>
                    <p className="mb-3 flex justify-between text-xs text-gray-500">
                      <span>{post.category}</span>
                      <span className="font-medium">{post.author}</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between">
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
                        <span className="text-gray-500">💬 {post.commentsCount ?? 0}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPostId(postId)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      {post.status === "Published" ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          disabled={saving}
                          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => persistExistingPost(post, "Published")}
                          disabled={saving}
                          className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="w-full lg:w-2/3">
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4">
              <h4 className="text-lg font-bold text-gray-900">
                {selectedPost ? (
                  <>
                    Edit Post: <span className="font-medium text-gray-600">{selectedPost.title}</span>
                  </>
                ) : (
                  <span>New Post</span>
                )}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setSelectedPostId(null);
                  setDraft(emptyDraft);
                }}
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
                      type="button"
                      className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                <textarea
                  value={draft.content}
                  onChange={(event) => handleChange("content", event.target.value)}
                  className="min-h-[300px] w-full resize-y p-4 text-sm text-gray-800 focus:outline-none"
                  placeholder="Write the blog content here..."
                />
              </div>

              <div className="flex w-full shrink-0 flex-col gap-5 lg:w-64">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                  Post Title
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) => handleChange("title", event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                  Category
                  <select
                    value={draft.category}
                    onChange={(event) => handleChange("category", event.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    {categories
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                  Author
                  <input
                    type="text"
                    value={draft.author}
                    onChange={(event) => handleChange("author", event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                  Tags
                  <input
                    type="text"
                    value={draft.tags}
                    onChange={(event) => handleChange("tags", event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                  Featured Image
                  <input
                    type="text"
                    value={draft.featuredImage}
                    onChange={(event) => handleChange("featuredImage", event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Image URL"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                  Excerpt
                  <textarea
                    value={draft.excerpt}
                    onChange={(event) => handleChange("excerpt", event.target.value)}
                    className="min-h-24 rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Short summary for the listing"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4">
              <button
                type="button"
                onClick={() => persistPost("Draft")}
                disabled={saving}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={() => persistPost("Published")}
                disabled={saving}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Publish Now
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}