const ContentBlog = require('../Model/ContentBlogModel');

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const getUniqueSlug = async (title, currentId = null) => {
  const baseSlug = slugify(title) || 'post';
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (
    await ContentBlog.findOne({
      slug: uniqueSlug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    counter += 1;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

const buildAuthorName = (user) => {
  if (!user) {
    return 'Ecofy Team';
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name || user.email || 'Ecofy Team';
};

const listBlogPosts = async (req, res) => {
  try {
    const {
      search = '',
      category,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
      ];
    }

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [posts, total] = await Promise.all([
      ContentBlog.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .populate('createdBy', 'firstName lastName email role'),
      ContentBlog.countDocuments(query),
    ]);

    return res.status(200).json({
      posts,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ContentBlog.findById(id).populate(
      'createdBy',
      'firstName lastName email role'
    );

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      category,
      author,
      excerpt,
      content,
      featuredImage,
      tags,
      status = 'Draft',
    } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        message: 'Please provide title, category, and content for the blog post',
      });
    }

    const normalizedStatus = status === 'Published' ? 'Published' : 'Draft';
    const slug = await getUniqueSlug(title);

    const newPost = await ContentBlog.create({
      title,
      slug,
      category,
      author: author || buildAuthorName(req.user),
      excerpt: excerpt || '',
      content,
      featuredImage: featuredImage || '',
      tags: normalizeTags(tags),
      status: normalizedStatus,
      publishedAt: normalizedStatus === 'Published' ? new Date() : null,
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({
      message: 'Blog post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      author,
      excerpt,
      content,
      featuredImage,
      tags,
      status,
    } = req.body;

    const post = await ContentBlog.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (title !== undefined && title !== post.title) {
      post.title = title;
      post.slug = await getUniqueSlug(title, post._id);
    }

    if (category !== undefined) {
      post.category = category;
    }

    if (author !== undefined) {
      post.author = author;
    }

    if (excerpt !== undefined) {
      post.excerpt = excerpt;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (featuredImage !== undefined) {
      post.featuredImage = featuredImage;
    }

    if (tags !== undefined) {
      post.tags = normalizeTags(tags);
    }

    if (status !== undefined) {
      post.status = status === 'Published' ? 'Published' : 'Draft';
      post.publishedAt = post.status === 'Published' ? post.publishedAt || new Date() : null;
    }

    const updatedPost = await post.save();

    return res.status(200).json({
      message: 'Blog post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await ContentBlog.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.status(200).json({
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};