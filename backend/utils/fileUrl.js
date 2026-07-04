import { isCloudinaryConfigured } from '../config/cloudinary.js';

// Cloudinary storage sets `file.path` to the real hosted URL already.
// Local disk storage sets `file.path` to a raw filesystem path (e.g.
// "D:\...\uploads\xyz.jpg" on Windows), which is useless as a web URL and
// was the root cause of images/CVs not loading. This builds a proper
// same-origin absolute URL (e.g. "http://localhost:5000/uploads/xyz.jpg")
// that works from any frontend origin, in dev and in production alike.
export const buildFileUrl = (req, file) => {
  if (isCloudinaryConfigured) return file.path;
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
};
