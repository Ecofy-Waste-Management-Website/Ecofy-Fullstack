import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogPostById } from '../../../services/api/blogService';

export default function BlogDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const post = await fetchBlogPostById(id);
        console.log('Article loaded:', post);
        console.log('Has content?', !!post?.content);
        setArticle(post);
      } catch (loadError) {
        console.error('Failed to load blog post:', loadError);
        setError('Unable to load blog content. Please try again.');
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-20 text-center text-slate-500">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-20 text-center text-slate-500">
        {error || 'Article not found.'}
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      <article className="mx-auto w-full max-w-4xl overflow-hidden px-4 py-20">

        <Link
          to="/blogs"
          className="text-[#397239] font-bold mb-8 inline-block hover:underline"
        >
          ← Back to Articles
        </Link>

        {/* FEATURED IMAGE */}
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="mb-10 h-[420px] w-full rounded-2xl object-cover shadow-lg"
          />
        )}

        {/* HEADER */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#397239] bg-green-50 px-3 py-1 rounded-full">
              {article.category}
            </span>
            {article.status && (
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {article.status}
              </span>
            )}
          </div>

          <h1 className="text-5xl font-extrabold text-[#0f1d33] mb-4">
            {article.title}
          </h1>

          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* METADATA */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-b border-slate-200 py-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">By</span>
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {article.viewCount !== undefined && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">•</span>
                  <span>{article.viewCount} views</span>
                </div>
              </>
            )}
            {article.commentsCount !== undefined && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">•</span>
                  <span>{article.commentsCount} comments</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* BLOG CONTENT */}
        <div className="my-12 prose prose-slate lg:prose-lg max-w-none">
          {article.content ? (
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
              {article.content}
            </div>
          ) : article.excerpt ? (
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
              {article.excerpt}
            </div>
          ) : (
            <p className="text-slate-400 italic">No content available.</p>
          )}
        </div>

        {/* TAGS */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-xs font-medium text-[#397239] bg-green-50 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ARTICLE STATS */}
        <div className="mt-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Article Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Published</p>
              <p className="font-semibold text-slate-700">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Updated</p>
              <p className="font-semibold text-slate-700">
                {new Date(article.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Views</p>
              <p className="font-semibold text-slate-700">{article.viewCount || 0}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Comments</p>
              <p className="font-semibold text-slate-700">{article.commentsCount || 0}</p>
            </div>
          </div>
        </div>

      </article>
    </main>
  );
}