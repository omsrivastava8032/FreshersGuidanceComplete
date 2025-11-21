import { Request, Response } from 'express';
import Internship from '../models/Internship';
import User from '../models/User';

// @desc    Get all internships
// @route   GET /api/internships
// @access  Private
export const getInternships = async (req: Request, res: Response) => {
    const internships = await Internship.find({}).sort({ createdAt: -1 });
    res.json(internships);
};

// @desc    Get internship by ID
// @route   GET /api/internships/:id
// @access  Private
export const getInternshipById = async (req: Request, res: Response) => {
    const internship = await Internship.findById(req.params.id);
    if (internship) {
        res.json(internship);
    } else {
        res.status(404).json({ message: 'Internship not found' });
    }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private/Admin
export const createInternship = async (req: Request, res: Response) => {
    const {
        company,
        position,
        location,
        type,
        tags,
        deadline,
        logo,
        description,
        duration,
        stipend
    } = req.body;

    const internship = await Internship.create({
        company,
        position,
        location,
        type,
        tags,
        deadline,
        logo,
        description,
        duration,
        stipend
    });

    res.status(201).json(internship);
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
export const updateInternship = async (req: Request, res: Response) => {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
        internship.company = req.body.company || internship.company;
        internship.position = req.body.position || internship.position;
        internship.location = req.body.location || internship.location;
        internship.type = req.body.type || internship.type;
        internship.tags = req.body.tags || internship.tags;
        internship.deadline = req.body.deadline || internship.deadline;
        internship.logo = req.body.logo || internship.logo;
        internship.description = req.body.description || internship.description;
        internship.duration = req.body.duration || internship.duration;
        internship.stipend = req.body.stipend || internship.stipend;

        const updatedInternship = await internship.save();
        res.json(updatedInternship);
    } else {
        res.status(404).json({ message: 'Internship not found' });
    }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
export const deleteInternship = async (req: Request, res: Response) => {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
        await internship.deleteOne();
        res.json({ message: 'Internship removed' });
    } else {
        res.status(404).json({ message: 'Internship not found' });
    }
};

// @desc    Apply for internship
// @route   POST /api/internships/:id/apply
// @access  Private
export const applyInternship = async (req: any, res: Response) => {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
        if (internship.applicants.includes(req.user._id)) {
            res.status(400).json({ message: 'Already applied' });
            return;
        }

        internship.applicants.push(req.user._id);
        await internship.save();
        res.json({ message: 'Application successful' });
    } else {
        res.status(404).json({ message: 'Internship not found' });
    }
};
