import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();

const checkUsers = async () => {
    try {
        await connectDB();
        const count = await User.countDocuments();
        console.log(`User count: ${count}`);

        if (count > 0) {
            const user = await User.findOne({ email: 'jane@example.com' });
            console.log('Jane found:', !!user);
            if (user) {
                console.log('Jane role:', user.role);
                console.log('Jane premium:', user.premium);
            }
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
