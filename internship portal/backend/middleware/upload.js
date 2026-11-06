const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure temp directory exists
const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe, collision-resistant filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeExt = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, safeExt)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    cb(null, `${safeBase}-${uniqueSuffix}${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Validate MIME type and extension
  if (file.mimetype === 'application/pdf' && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF documents are allowed.'), false);
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024; // 5 MB

const uploadResume = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter,
});

module.exports = {
  uploadResume,
  uploadDir,
  tempDir,
};
