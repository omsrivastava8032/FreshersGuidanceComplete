import { Request, Response } from 'express';
import User from '../models/User';
import Goal from '../models/Goal';
import Course from '../models/Course';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        // Also delete user's goals and courses? Ideally yes, but for now just user.
        // await Goal.deleteMany({ userId: user._id });
        // await Course.deleteMany({ userId: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response) => {
    const user: any = await User.findById(req.params.id)
        .select('-password')
        .populate('savedInternships');

    if (user) {
        // Fetch goals and courses for this user
        const goals = await Goal.find({ userId: user._id });
        const courses = await Course.find({ userId: user._id });

        res.json({
            ...user.toObject(),
            goals,
            courses
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Toggle saved internship
// @route   POST /api/users/saved-internships/:id
// @access  Private
export const toggleSavedInternship = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);
    const internshipId = req.params.id;

    if (user) {
        const userAny = user as any;
        const isSaved = userAny.savedInternships.includes(internshipId);

        if (isSaved) {
            userAny.savedInternships = userAny.savedInternships.filter(
                (id: any) => id.toString() !== internshipId
            );
            await userAny.save();
            res.json({ message: 'Internship removed from saved', saved: false });
        } else {
            userAny.savedInternships.push(internshipId);
            await userAny.save();
            res.json({ message: 'Internship saved', saved: true });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get saved internships
// @route   GET /api/users/saved-internships
// @access  Private
export const getSavedInternships = async (req: any, res: Response) => {
    const user: any = await User.findById(req.user._id).populate('savedInternships');

    if (user) {
        res.json(user.savedInternships);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
