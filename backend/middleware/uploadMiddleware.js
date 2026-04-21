const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

// File filter: JPEG only
const fileFilter = (req, file, cb) => {
  const isJpeg =
    file.mimetype === "image/jpeg" || file.mimetype === "image/jpg";
  if (isJpeg) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG/JPG images are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 }, // 100 KB
  fileFilter,
});

module.exports = upload;
