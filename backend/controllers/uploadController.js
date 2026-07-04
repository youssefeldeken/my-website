import { buildFileUrl } from '../utils/fileUrl.js';

// @desc  Generic image upload endpoint used by the admin dashboard
//        (profile picture, project cover/gallery, company logos, certs)
// @route POST /api/uploads
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = buildFileUrl(req, req.file);
    res.status(201).json({ success: true, url });
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const urls = req.files.map((f) => buildFileUrl(req, f));
    res.status(201).json({ success: true, urls });
  } catch (error) {
    next(error);
  }
};
