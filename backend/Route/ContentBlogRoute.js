const express = require('express');
const { upload, uploadToCloudinary } = require('../Middleware/cloudinaryUpload.js');
const {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../Controllers/contentBlogController.js');

const router = express.Router();

const handleImage = [upload.single('featuredImage'), uploadToCloudinary];

router.get('/', listBlogPosts);
router.post('/', ...handleImage, createBlogPost);
router.get('/:id', getBlogPostById);
router.patch('/:id', ...handleImage, updateBlogPost);
router.delete('/:id', deleteBlogPost);

module.exports = router;
