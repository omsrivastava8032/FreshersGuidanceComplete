import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import goalRoutes from './routes/goalRoutes';
import courseRoutes from './routes/courseRoutes';
import supportRoutes from './routes/supportRoutes';
import userRoutes from './routes/userRoutes';
import internshipRoutes from './routes/internshipRoutes';
import courseCatalogRoutes from './routes/courseCatalogRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

app.use(cors({
    origin: [
        'http://localhost:8080',
        'https://freshers-guidance-complete-3ygp29dh8.vercel.app',
        'https://freshers-guidance-complete.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses', courseCatalogRoutes); // Mount under /api/courses so it becomes /api/courses/catalog
app.use('/api/support', supportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
