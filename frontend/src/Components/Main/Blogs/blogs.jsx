import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import { fetchPublishedBlogPosts } from '../../../services/api/blogService';
import { Link } from 'react-router-dom';

const iconByThumbnail = {
  bottle: '🧴',
  cleanup: '🧑‍🧹',
  compost: '🌱',
};

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function Blogs() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gridRef, gridVis] = useFadeIn(0.1);

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
    <div className="min-h-screen bg-[#D6E9CA]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#397234] pt-36 pb-20 px-4 text-center">
        <svg className="absolute -right-8 -top-8 h-48 w-48 opacity-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5V11m0 0a5 5 0 0 1 5-5h2.5c0 4.5-2 6.5-4 8l-3.5 3m0-11a5 5 0 0 0-5-5H7c0 4.5 2 6.5 4 8l3.5 3" />
        </svg>
        <svg className="absolute -left-8 bottom-0 h-40 w-40 opacity-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <h1 className="text-5xl font-black text-white tracking-tight mb-4">Read Blogs Here</h1>
        <p className="text-lg text-green-100/80 font-medium max-w-md mx-auto">
          Insights, stories, and updates from Sri Lanka's smart waste platform.
        </p>
      </div>

      {/* Blog Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div ref={gridRef}>
          <div className={`transition-all duration-700
                ${gridVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {loading ? (
              <div className="rounded-3xl border border-[#397234]/10 bg-white/60 p-10 text-center text-[#397234]/60 shadow-sm">
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
                    <article className="overflow-hidden rounded-3xl border border-[#397234]/10 bg-white/60 shadow-sm transition-all duration-300 group-hover:-translate-y-1 hover:shadow-md">

                      {/* IMAGE SECTION */}
                      <div className="h-56 overflow-hidden bg-[#D6E9CA]">

                        {article.featuredImage ? (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#D6E9CA]">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                              {iconByThumbnail[article.thumbnail] || '📰'}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* CONTENT */}
                      <div className="space-y-4 p-6">

                        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest text-[#397234]/50">
                          <span>{article.category}</span>
                          <span>{article.comments || 0} comments</span>
                        </div>

                        <h2 className="text-xl font-black leading-tight text-[#244c21]">
                          {article.title}
                        </h2>
                        <div
                          className="text-sm leading-7 text-[#244c21]/60 line-clamp-3 break-words overflow-hidden"
                          dangerouslySetInnerHTML={{
                            __html:
                              article.excerpt ||
                              "Read the full story from the Ecofy content team.",
                          }}
                        />
                        <div className="flex items-center justify-between border-t border-[#397234]/10 pt-4 text-sm text-[#244c21]/70">
                          <span className="font-semibold">By {article.author}</span>

                          <span className="rounded-full bg-[#D6E9CA] px-3 py-1 font-bold text-[#397234]">
                            Published
                          </span>
                        </div>

                      </div>
                    </article>
                  </Link>
                ))}

              </div>
            ) : (
              <div className="rounded-3xl border border-[#397234]/10 bg-white/60 p-10 text-center text-[#397234]/60 shadow-sm">
                No published articles yet. Publish one from the admin CMS to feature it here.
              </div>
            )}
          </div>

        </div>
      </section>

      <footer className="w-full border-t border-slate-200 bg-white py-8 text-center mt-auto">
        <p className="text-sm font-medium text-slate-500">
          © 2026 Ecofy. Made with 💚 for a cleaner Sri Lanka.
        </p>
      </footer>

    </div>
  );
}