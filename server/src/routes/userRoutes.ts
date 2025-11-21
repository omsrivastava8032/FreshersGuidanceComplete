import express from 'express';
import { getAllUsers, deleteUser, getUserById } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(admin);

router.route('/')
    .get(getAllUsers);

router.route('/:id')
    .get(getUserById)
    .delete(deleteUser);

export default router;
