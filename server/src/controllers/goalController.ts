import { Request, Response } from 'express';
import Goal from '../models/Goal';

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req: any, res: Response) => {
    const goals = await Goal.find({ userId: req.user._id });
    res.json(goals);
};

// @desc    Get pending goals (Admin)
// @route   GET /api/goals/pending
// @access  Private/Admin
export const getPendingGoals = async (req: any, res: Response) => {
    const goals = await Goal.find({ status: 'pending' }).populate('userId', 'name email');
    res.json(goals);
};

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req: any, res: Response) => {
    const { title, description, category, priority, tasks, targetDate, status } = req.body;

    if (!title || !description || !category) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
    }

    const goal = await Goal.create({
        userId: req.user._id,
        title,
        description,
        category,
        priority,
        tasks,
        targetDate,
        status: status || 'active' // Default to active if not specified, though frontend might send 'pending'
    });

    res.status(201).json(goal);
};

// @desc    Update goal
// @route   PATCH /api/goals/:id
// @access  Private
export const updateGoal = async (req: any, res: Response) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404).json({ message: 'Goal not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the goal user OR user is admin
    if (goal.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedGoal);
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req: any, res: Response) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404).json({ message: 'Goal not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the goal user OR user is admin
    if (goal.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await goal.deleteOne();

    res.json({ id: req.params.id });
};
