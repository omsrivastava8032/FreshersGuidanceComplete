import express from 'express';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getCourses).post(protect, createCourse);
router.route('/:id').patch(protect, updateCourse).delete(protect, deleteCourse);

export default router;
