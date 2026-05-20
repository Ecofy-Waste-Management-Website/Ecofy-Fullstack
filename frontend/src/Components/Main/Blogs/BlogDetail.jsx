import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublishedArticles } from '../../../services/articleStore';

export default function BlogDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const allArticles = getPublishedArticles();
    const found = allArticles.find((a) => a.id === Number(id));
    setArticle(found);
  }, [id]);

  if (!article) {
    return (
      <div className="p-20 text-center">
        Article not found.
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

        <header className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#397239] mb-2">
            {article.category}
          </div>

          <h1 className="text-4xl font-extrabold text-[#0f1d33] mb-4">
            {article.title}
          </h1>

          <div className="text-slate-500 text-sm">
            By {article.author} • {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* FEATURED IMAGE */}
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="mb-10 h-[420px] w-full rounded-2xl object-cover shadow-lg"
          />
        )}

      {/* BLOG CONTENT */}
<div className="mt-10 overflow-hidden">
  <div
    className="
      prose
      prose-slate
      lg:prose-lg
      max-w-none
      break-words
      overflow-hidden

      prose-img:rounded-2xl
      prose-img:w-full
      prose-img:max-w-full

      prose-p:text-slate-700
      prose-p:leading-8

      prose-pre:overflow-x-auto
      prose-code:break-words
    "
    dangerouslySetInnerHTML={{
      __html: article.content || article.excerpt,
    }}
  />
</div>
      </article>
    </main>
  );
}