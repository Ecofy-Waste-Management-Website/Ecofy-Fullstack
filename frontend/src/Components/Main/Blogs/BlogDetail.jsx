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

  if (!article) return <div className="p-20 text-center">Article not found.</div>;

  return (
    <main className="bg-white min-h-screen">
      <article className="mx-auto max-w-3xl px-4 py-20">
        <Link to="/blogs" className="text-[#397239] font-bold mb-8 inline-block hover:underline">
          ← Back to Articles
        </Link>
        
        <header className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#397239] mb-2">
            {article.category}
          </div>
          <h1 className="text-4xl font-extrabold text-[#0f1d33] mb-4">{article.title}</h1>
          <div className="text-slate-500 text-sm">
            By {article.author} • {new Date().toLocaleDateString()}
          </div>
        </header>

        <div className="prose prose-slate lg:prose-lg text-slate-700 leading-relaxed">
          {/* This renders the content. If you have HTML content, use dangerouslySetInnerHTML */}
          <p className="whitespace-pre-wrap">{article.content || article.excerpt}</p>
        </div>
      </article>
    </main>
  );
}