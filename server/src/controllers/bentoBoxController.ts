import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import BentoBox from '../models/BentoBox.js';

// Create a new bento box
export const createBentoBox = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, ingredients, thumbnail, isPublic } = req.body;

    const bentoBox = new BentoBox({
      userId: req.userId,
      name,
      description,
      ingredients,
      thumbnail,
      isPublic: isPublic || false,
    });

    await bentoBox.save();
    res.status(201).json(bentoBox);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bento boxes for the current user
export const getUserBentoBoxes = async (req: AuthRequest, res: Response) => {
  try {
    const bentoBoxes = await BentoBox.find({ userId: req.userId })
      .sort({ updatedAt: -1 });

    res.json(bentoBoxes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single bento box by ID
export const getBentoBoxById = async (req: AuthRequest, res: Response) => {
  try {
    const bentoBox = await BentoBox.findById(req.params.id);

    if (!bentoBox) {
      return res.status(404).json({ error: 'Bento box not found' });
    }

    // Check if user owns this bento box or if it's public
    if (bentoBox.userId.toString() !== req.userId && !bentoBox.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(bentoBox);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a bento box
export const updateBentoBox = async (req: AuthRequest, res: Response) => {
  try {
    const bentoBox = await BentoBox.findById(req.params.id);

    if (!bentoBox) {
      return res.status(404).json({ error: 'Bento box not found' });
    }

    // Check if user owns this bento box
    if (bentoBox.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, description, ingredients, thumbnail, isPublic } = req.body;

    bentoBox.name = name || bentoBox.name;
    bentoBox.description = description !== undefined ? description : bentoBox.description;
    bentoBox.ingredients = ingredients || bentoBox.ingredients;
    bentoBox.thumbnail = thumbnail || bentoBox.thumbnail;
    bentoBox.isPublic = isPublic !== undefined ? isPublic : bentoBox.isPublic;

    await bentoBox.save();
    res.json(bentoBox);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a bento box
export const deleteBentoBox = async (req: AuthRequest, res: Response) => {
  try {
    const bentoBox = await BentoBox.findById(req.params.id);

    if (!bentoBox) {
      return res.status(404).json({ error: 'Bento box not found' });
    }

    // Check if user owns this bento box
    if (bentoBox.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await BentoBox.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bento box deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get public bento boxes (for browsing)
export const getPublicBentoBoxes = async (req: AuthRequest, res: Response) => {
  try {
    const bentoBoxes = await BentoBox.find({ isPublic: true })
      .populate('userId', 'username')
      .sort({ likes: -1, createdAt: -1 })
      .limit(50);

    res.json(bentoBoxes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
