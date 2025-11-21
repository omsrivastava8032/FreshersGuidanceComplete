import express from 'express';
import { getTickets, createTicket, getAllTickets, updateTicket } from '../controllers/supportController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.route('/admin').get(protect, admin, getAllTickets);
router.route('/:id').patch(protect, admin, updateTicket);

export default router;
