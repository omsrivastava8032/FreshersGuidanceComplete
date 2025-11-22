import express from 'express';
import { getCatalog } from '../controllers/courseCatalogController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/catalog').get(protect, getCatalog);

export default router;
