import express from 'express';
import {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    applyInternship,
} from '../controllers/internshipController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getInternships)
    .post(protect, admin, createInternship);

router.route('/:id')
    .get(protect, getInternshipById)
    .put(protect, admin, updateInternship)
    .delete(protect, admin, deleteInternship);

router.route('/:id/apply').post(protect, applyInternship);

export default router;
