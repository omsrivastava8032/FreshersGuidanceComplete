import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal, getPendingGoals } from '../controllers/goalController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, createGoal);
router.route('/pending').get(protect, admin, getPendingGoals);
router.route('/:id').patch(protect, updateGoal).delete(protect, deleteGoal);

export default router;
