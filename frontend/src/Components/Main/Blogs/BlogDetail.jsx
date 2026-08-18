import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Top-Header-Section/navbar/navbar';
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
      <div className="min-h-screen bg-[#D6E9CA] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-[#397234]/10 bg-white/60 px-10 py-8 text-center text-[#397234]/60 shadow-sm">
          Loading article...
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#D6E9CA] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-[#397234]/10 bg-white/60 px-10 py-8 text-center text-[#397234]/60 shadow-sm">
          {error || 'Article not found.'}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#D6E9CA] overflow-x-hidden">
      <Navbar />

      <article className="mx-auto w-full max-w-4xl overflow-hidden px-4 pt-36 pb-20">

        <Link
          to="/blogs"
          className="text-[#397234] font-bold mb-8 inline-flex items-center gap-1 hover:underline"
        >
          ← Back to Articles
        </Link>

        <div className="rounded-3xl border border-[#397234]/10 bg-white/60 shadow-sm overflow-hidden">

          {/* FEATURED IMAGE */}
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="h-[420px] w-full object-cover"
            />
          )}

          <div className="p-8 md:p-12">

            {/* HEADER */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#397234] bg-[#D6E9CA] px-3 py-1 rounded-full">
                  {article.category}
                </span>
                {article.status && (
                  <span className="text-xs font-bold uppercase tracking-widest text-[#244c21]/60 bg-[#244c21]/5 px-3 py-1 rounded-full">
                    {article.status}
                  </span>
                )}
              </div>

              <h1 className="text-5xl font-black text-[#244c21] mb-4 tracking-tight">
                {article.title}
              </h1>

              <p className="text-lg text-[#244c21]/60 mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              {/* METADATA */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#244c21]/60 border-t border-b border-[#397234]/10 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#244c21]">By</span>
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#397234]/30">•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                {article.viewCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#397234]/30">•</span>
                    <span>{article.viewCount} views</span>
                  </div>
                )}
                {article.commentsCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#397234]/30">•</span>
                    <span>{article.commentsCount} comments</span>
                  </div>
                )}
              </div>
            </header>

            {/* BLOG CONTENT */}
            <div className="my-12 prose prose-slate lg:prose-lg max-w-none">
              {article.content ? (
                <div className="whitespace-pre-wrap text-[#244c21]/80 leading-relaxed text-base">
                  {article.content}
                </div>
              ) : article.excerpt ? (
                <div className="whitespace-pre-wrap text-[#244c21]/80 leading-relaxed text-base">
                  {article.excerpt}
                </div>
              ) : (
                <p className="text-[#244c21]/40 italic">No content available.</p>
              )}
            </div>

            {/* TAGS */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#397234]/10">
                <h3 className="text-sm font-bold text-[#244c21] mb-4 uppercase tracking-widest">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-xs font-semibold text-[#397234] bg-[#D6E9CA] rounded-full border border-[#397234]/20 hover:bg-[#397234]/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ARTICLE STATS */}
            <div className="mt-12 p-6 bg-[#D6E9CA]/50 rounded-2xl border border-[#397234]/10">
              <h3 className="text-sm font-bold text-[#244c21] mb-4 uppercase tracking-widest">Article Info</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-[#244c21]/50 mb-1">Published</p>
                  <p className="font-bold text-[#244c21]">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[#244c21]/50 mb-1">Updated</p>
                  <p className="font-bold text-[#244c21]">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[#244c21]/50 mb-1">Views</p>
                  <p className="font-bold text-[#244c21]">{article.viewCount || 0}</p>
                </div>
                <div>
                  <p className="text-[#244c21]/50 mb-1">Comments</p>
                  <p className="font-bold text-[#244c21]">{article.commentsCount || 0}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </article>

      
    </main>
  );
}