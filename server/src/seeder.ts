import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getUsers from './data/users';
import internships from './data/internships';
import { courses } from './data/courses';
import User from './models/User';
import Goal from './models/Goal';
import Course from './models/Course';
import Internship from './models/Internship';
import CourseCatalog from './models/CourseCatalog';
import connectDB from './config/db';

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Goal.deleteMany();
        await Course.deleteMany();
        await Internship.deleteMany();
        await CourseCatalog.deleteMany();

        const users = await getUsers();
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        await Internship.insertMany(internships);
        await CourseCatalog.insertMany(courses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Goal.deleteMany();
        await Course.deleteMany();
        await Internship.deleteMany();
        await CourseCatalog.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
