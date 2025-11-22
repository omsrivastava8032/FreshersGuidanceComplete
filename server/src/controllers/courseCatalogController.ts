import { Request, Response } from 'express';
import CourseCatalog from '../models/CourseCatalog';

// @desc    Get all courses in catalog
// @route   GET /api/courses/catalog
// @access  Private
export const getCatalog = async (req: Request, res: Response) => {
    try {
        const courses = await CourseCatalog.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
