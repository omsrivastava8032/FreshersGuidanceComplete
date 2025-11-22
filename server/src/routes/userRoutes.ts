import express from 'express';
import {
    getAllUsers as getUsers,
    getUserById,
    deleteUser,
    toggleSavedInternship,
    getSavedInternships
} from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/saved-internships').get(protect, getSavedInternships);
router.route('/saved-internships/:id').post(protect, toggleSavedInternship);
router.route('/:id').get(protect, admin, getUserById).delete(protect, admin, deleteUser);

export default router;
