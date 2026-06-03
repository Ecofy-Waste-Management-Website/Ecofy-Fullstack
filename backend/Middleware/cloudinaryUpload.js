const multer = require("multer");
const cloudinary = require("../config/cloudinary.js");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|jpg)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only jpg/jpeg/png images are allowed"), false);
  },
});

// After multer stores the file in memory, stream it to Cloudinary.
// Attaches the result to req.file.path (Cloudinary secure_url) so the
// controller can read it the same way as before.
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();

  const stream = cloudinary.uploader.upload_stream(
    { folder: "Ecofy_Blog_Images" },
    (error, result) => {
      if (error) return next(error);
      req.file.path = result.secure_url;
      next();
    }
  );

  stream.end(req.file.buffer);
};

module.exports = { upload, uploadToCloudinary };
