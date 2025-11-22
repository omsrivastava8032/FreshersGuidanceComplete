import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import goalRoutes from './routes/goalRoutes';
import courseRoutes from './routes/courseRoutes';
import supportRoutes from './routes/supportRoutes';
import userRoutes from './routes/userRoutes';
import internshipRoutes from './routes/internshipRoutes';
import courseCatalogRoutes from './routes/courseCatalogRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:5173',
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

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
