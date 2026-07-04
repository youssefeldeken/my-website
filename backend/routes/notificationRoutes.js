import express from 'express';
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
} from '../controllers/notificationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getNotifications);
router.patch('/read-all', protect, adminOnly, markAllNotificationsRead);
router.patch('/:id/read', protect, adminOnly, markNotificationRead);

export default router;
