import React, { useEffect, useState } from 'react';
import { fetchPublishedBlogPosts } from '../../../services/api/blogService';
import { Link } from 'react-router-dom';

const iconByThumbnail = {
  bottle: '🧴',
  cleanup: '🧑‍🧹',
  compost: '🌱',
};

export default function Blogs() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const posts = await fetchPublishedBlogPosts();
        setArticles(posts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <main className="bg-[#f4faf6] text-[#0f1d33]">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#397239]">
            Ecofy blog
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0f1d33] sm:text-4xl">
            All Articles
          </h1>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
            Loading articles...
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {articles.map((article) => (
              <Link
                to={`/blogs/${article._id}`}
                key={article._id}
                className="group block"
              >
                <article className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_18px_45px_rgba(15,29,51,0.08)] transition-all duration-300 group-hover:-translate-y-1">

                  {/* IMAGE SECTION */}
                  <div className="h-56 overflow-hidden bg-slate-100">

                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-sky-100">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm">
                          {iconByThumbnail[article.thumbnail] || '📰'}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="space-y-4 p-6">

                    <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#397239]">
                      <span>{article.category}</span>
                      <span>{article.comments || 0} comments</span>
                    </div>

                    <h2 className="text-xl font-bold leading-tight text-[#0f1d33]">
                      {article.title}
                    </h2>
             <div
  className="text-sm leading-7 text-slate-600 line-clamp-3 break-words overflow-hidden"
  dangerouslySetInnerHTML={{
    __html:
      article.excerpt ||
      "Read the full story from the Ecofy content team.",
  }}
/>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                      <span>By {article.author}</span>

                      <span className="rounded-full bg-green-50 px-3 py-1 font-semibold text-[#397239]">
                        Published
                      </span>
                    </div>

                  </div>
                </article>
              </Link>
            ))}

          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
            No published articles yet. Publish one from the admin CMS to feature it here.
          </div>
        )}

      </section>
    </main>
  );
}