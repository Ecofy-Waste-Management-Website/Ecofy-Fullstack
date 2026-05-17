const express = require('express');
const { isAuthenticated, isAdmin } = require('../Middleware/authMiddleware.js');
const {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../Controllers/contentBlogController.js');

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.get('/', listBlogPosts);
router.post('/', createBlogPost);
router.get('/:id', getBlogPostById);
router.patch('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

module.exports = router;