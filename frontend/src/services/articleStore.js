const STORAGE_KEY = "ecofy_articles";


  // READ ARTICLES (SAFE)

const readStoredArticles = () => {
  if (typeof window === "undefined") return [];

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    const empty = [];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    return empty;
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

  // WRITE ARTICLES (SYNC + EVENT)

const writeStoredArticles = (articles) => {
  if (typeof window === "undefined") return articles;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));

  // notify all pages (admin + blog page sync)
  window.dispatchEvent(new Event("ecofy-articles-updated"));

  return articles;
};

   //GET ALL ARTICLES
export const getArticles = () => readStoredArticles();

   //GET ONLY PUBLISHED ARTICLES

export const getPublishedArticles = () =>
  readStoredArticles()
    .filter((article) => article.status === "Published")
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });


   //UPDATE ARTICLE
export const updateArticle = (articleId, changes) => {
  const updated = readStoredArticles().map((article) =>
    article.id === articleId ? { ...article, ...changes } : article
  );

  return writeStoredArticles(updated);
};


  // DELETE ARTICLE

export const deleteArticle = (articleId) => {
  const updated = readStoredArticles().filter(
    (article) => article.id !== articleId
  );

  return writeStoredArticles(updated);
};


   //CREATE ARTICLE

export const createArticle = (article) => {
  const current = readStoredArticles();

  const nextId =
    current.length > 0
      ? Math.max(...current.map((a) => a.id)) + 1
      : 1;

  const newArticle = {
    id: nextId,
    title: article.title,
    category: article.category || "General",
    author: article.author || "Admin",
    comments: 0,
    status: article.status || "Draft",
    thumbnail: article.thumbnail || "bottle",
    excerpt: article.excerpt || "",
    content: article.content || "",
    createdAt: new Date().toISOString(),
    publishedAt:
      article.status === "Published" ? new Date().toISOString() : null,
  };

  const updated = [newArticle, ...current];

  return writeStoredArticles(updated);
};


   //SET STATUS (PUBLISH / DRAFT)
export const setArticleStatus = (articleId, status) => {
  const publishedAt =
    status === "Published" ? new Date().toISOString() : null;

  return updateArticle(articleId, {
    status,
    publishedAt,
  });
};
export const articleStoreKey = STORAGE_KEY;