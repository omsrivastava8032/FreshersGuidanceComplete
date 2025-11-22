import express from 'express';
import { chatWithGemini } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', protect, chatWithGemini);

export default router;
