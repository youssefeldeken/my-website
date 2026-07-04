import express from 'express';
import { uploadResume, getActiveResume } from '../controllers/resumeController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getActiveResume);
router.post('/', protect, adminOnly, upload.single('resume'), uploadResume);

export default router;
