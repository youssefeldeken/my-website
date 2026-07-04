import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage as cloudinaryStorage, isCloudinaryConfigured } from '../config/cloudinary.js';

// Local disk fallback so the app runs out of the box even before Cloudinary
// credentials are added to .env.
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  if (extOk) return cb(null, true);
  cb(new Error('Only images (jpg, png, webp) and PDF files are allowed'));
};

const upload = multer({
  storage: isCloudinaryConfigured ? cloudinaryStorage : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

export default upload;
