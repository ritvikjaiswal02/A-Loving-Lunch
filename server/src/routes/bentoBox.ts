import express from 'express';
import {
  createBentoBox,
  getUserBentoBoxes,
  getBentoBoxById,
  updateBentoBox,
  deleteBentoBox,
  getPublicBentoBoxes,
} from '../controllers/bentoBoxController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new bento box
router.post('/', createBentoBox);

// Get all bento boxes for the current user
router.get('/my', getUserBentoBoxes);

// Get public bento boxes
router.get('/public', getPublicBentoBoxes);

// Get a single bento box by ID
router.get('/:id', getBentoBoxById);

// Update a bento box
router.put('/:id', updateBentoBox);

// Delete a bento box
router.delete('/:id', deleteBentoBox);

export default router;
