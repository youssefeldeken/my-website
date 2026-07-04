import Resume from '../models/Resume.js';
import Settings from '../models/Settings.js';
import { buildFileUrl } from '../utils/fileUrl.js';

// @desc  Upload/replace the active CV file
// @route POST /api/resume
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    await Resume.updateMany({}, { active: false });
    const fileUrl = buildFileUrl(req, req.file);
    const resume = await Resume.create({
      fileUrl,
      fileName: req.file.originalname,
      active: true,
    });

    await Settings.findOneAndUpdate({}, { resumeUrl: fileUrl }, { upsert: true });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc  Get the currently active CV
// @route GET /api/resume
export const getActiveResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ active: true }).sort({ createdAt: -1 });
    if (!resume) return res.status(404).json({ success: false, message: 'No CV uploaded yet' });
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};
