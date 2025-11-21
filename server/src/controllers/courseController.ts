import { Request, Response } from 'express';
import Course from '../models/Course';

// @desc    Get courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req: any, res: Response) => {
    const courses = await Course.find({ userId: req.user._id });
    res.json(courses);
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private
export const createCourse = async (req: any, res: Response) => {
    const { title, provider, status, progress } = req.body;

    if (!title || !provider) {
        res.status(400).json({ message: 'Please add title and provider' });
        return;
    }

    const course = await Course.create({
        userId: req.user._id,
        title,
        provider,
        status,
        progress,
    });

    res.status(201).json(course);
};

// @desc    Update course
// @route   PATCH /api/courses/:id
// @access  Private
export const updateCourse = async (req: any, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
    }

    if (course.userId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedCourse);
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
export const deleteCourse = async (req: any, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
    }

    if (course.userId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await course.deleteOne();

    res.json({ id: req.params.id });
};
