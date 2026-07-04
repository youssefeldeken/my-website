import express from 'express';
import { body } from 'express-validator';
import {
  createMessage, getMessages, updateMessageStatus, deleteMessage,
} from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail(),
    body('subject').notEmpty().trim(),
    body('message').notEmpty().trim(),
  ],
  validate,
  createMessage
);
router.get('/', protect, adminOnly, getMessages);
router.patch('/:id/status', protect, adminOnly, updateMessageStatus);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
