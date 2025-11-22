import express from 'express';
import { chatWithGemini, listModels } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', protect, chatWithGemini);
router.get('/debug', listModels);

export default router;
