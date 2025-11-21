import { Request, Response } from 'express';
import SupportTicket from '../models/SupportTicket';

// @desc    Get support tickets
// @route   GET /api/support
// @access  Private
export const getTickets = async (req: any, res: Response) => {
    const tickets = await SupportTicket.find({ userId: req.user._id });
    res.json(tickets);
};

// @desc    Create support ticket
// @route   POST /api/support
// @access  Private
export const createTicket = async (req: any, res: Response) => {
    const { subject, message } = req.body;

    if (!subject || !message) {
        res.status(400).json({ message: 'Please add subject and message' });
        return;
    }

    const ticket = await SupportTicket.create({
        userId: req.user._id,
        userEmail: req.user.email,
        subject,
        message,
    });

    res.status(201).json(ticket);
};

// @desc    Get all tickets (Admin)
// @route   GET /api/support/admin
// @access  Private/Admin
export const getAllTickets = async (req: any, res: Response) => {
    const tickets = await SupportTicket.find({});
    res.json(tickets);
};

// @desc    Update ticket (Admin response)
// @route   PATCH /api/support/:id
// @access  Private/Admin
export const updateTicket = async (req: any, res: Response) => {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        res.status(404).json({ message: 'Ticket not found' });
        return;
    }

    const updatedTicket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedTicket);
};
