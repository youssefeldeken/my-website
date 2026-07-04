import express from 'express';
import { uploadImage, uploadImages } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/single', protect, adminOnly, upload.single('image'), uploadImage);
router.post('/multiple', protect, adminOnly, upload.array('images', 10), uploadImages);

export default router;
