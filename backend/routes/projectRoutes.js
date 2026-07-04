import express from 'express';
import {
  getProjects, getProjectBySlug, createProject, updateProject, deleteProject, toggleProjectFlag,
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.patch('/:id/toggle', protect, adminOnly, toggleProjectFlag);

export default router;
