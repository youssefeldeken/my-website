import express from 'express';
import controller from '../controllers/certificateController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', protect, adminOnly, controller.create);
router.put('/:id', protect, adminOnly, controller.update);
router.delete('/:id', protect, adminOnly, controller.remove);

export default router;
