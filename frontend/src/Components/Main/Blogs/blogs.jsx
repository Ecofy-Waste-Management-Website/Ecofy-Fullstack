import React, { useEffect,  useRef, useState } from 'react';
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
    <div className="bg-[#ffffff] text-[#000000] pt-40 font-inter tracking-tight" >
      <div className=" text-black py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4 ">Read Blogs Here</h1>
          <p className="text-xl text-black font-bold opacity-80">
            Insights, stories, and updates from Sri Lanka's smart waste platform.
          </p>
        </div>
      </div>
    
      <section className="bg-[#ffffff] py-20 px-4">
        <div ref={gridRef} className="max-w-7xl mx-auto">

          <div className={`transition-all duration-700
                ${gridVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

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
          </div>

        </div>
      </section>

      {/* NEW SMALL FOOTER ADDED HERE */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 text-center mt-auto">
        <p className="text-sm font-medium text-slate-500">
          © 2026 Ecofy. Made with 💚 for a cleaner Sri Lanka.
        </p>
      </footer>
      
    </div>
  );
}