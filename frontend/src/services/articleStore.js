const STORAGE_KEY = "ecofy_articles";

const defaultArticles = [
  {
    id: 1,
    title: "5 Tips for Reducing Home Plastic",
    category: "Recycling Tips",
    author: "M.N. Mohamed",
    comments: 12,
    status: "Published",
    thumbnail: "bottle",
    excerpt: "Small changes at home can reduce daily plastic waste and make recycling easier.",
    createdAt: "2026-04-10T08:00:00.000Z",
    publishedAt: "2026-04-10T08:00:00.000Z",
  },
  {
    id: 2,
    title: "Upcoming Beach Cleanup Drive",
    category: "Community Events",
    author: "Guest Contributor",
    comments: 0,
    status: "Draft",
    thumbnail: "cleanup",
    excerpt: "A community-led cleanup event for coastal neighborhoods and volunteers.",
    createdAt: "2026-04-15T09:00:00.000Z",
    publishedAt: null,
  },
  {
    id: 3,
    title: "Composting 101: A Beginner's Guide",
    category: "Eco-Guides",
    author: "M.N. Mohamed",
    comments: 5,
    status: "Published",
    thumbnail: "compost",
    excerpt: "Learn how to start a simple composting routine at home in a few steps.",
    createdAt: "2026-04-18T10:30:00.000Z",
    publishedAt: "2026-04-18T10:30:00.000Z",
  },
];

const readStoredArticles = () => {
  if (typeof window === "undefined") {
    return defaultArticles;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArticles));
    return defaultArticles;
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : defaultArticles;
  } catch {
    return defaultArticles;
  }
};

const writeStoredArticles = (articles) => {
  if (typeof window === "undefined") {
    return articles;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  window.dispatchEvent(new Event("ecofy-articles-updated"));
  return articles;
};

export const getArticles = () => readStoredArticles();

export const getPublishedArticles = () =>
  readStoredArticles()
    .filter((article) => article.status === "Published")
    .sort((left, right) => {
      const leftDate = new Date(left.publishedAt || left.createdAt || 0).getTime();
      const rightDate = new Date(right.publishedAt || right.createdAt || 0).getTime();
      return rightDate - leftDate;
    });

export const updateArticle = (articleId, changes) => {
  const nextArticles = readStoredArticles().map((article) =>
    article.id === articleId ? { ...article, ...changes } : article
  );

  return writeStoredArticles(nextArticles);
};

export const deleteArticle = (articleId) => {
  const nextArticles = readStoredArticles().filter((article) => article.id !== articleId);
  return writeStoredArticles(nextArticles);
};

export const createArticle = (article) => {
  const currentArticles = readStoredArticles();
  const nextId = currentArticles.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
  const nextArticles = [
    {
      id: nextId,
      createdAt: new Date().toISOString(),
      publishedAt: article.status === "Published" ? new Date().toISOString() : null,
      comments: 0,
      thumbnail: "bottle",
      excerpt: "",
      ...article,
    },
    ...currentArticles,
  ];

  return writeStoredArticles(nextArticles);
};

export const setArticleStatus = (articleId, status) => {
  const publishedAt = status === "Published" ? new Date().toISOString() : null;

  return updateArticle(articleId, {
    status,
    publishedAt,
  });
};

export const articleStoreKey = STORAGE_KEY;