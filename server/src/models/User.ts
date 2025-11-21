import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    premium: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    academicInfo: {
        university: String,
        major: String,
        graduationYear: String,
        gpa: String,
        class10Percentage: String,
        class12Percentage: String,
        board: String,
        branch: String,
        college: String,
        degree: String,
    },
    preferences: {
        notifications: { type: Boolean, default: true },
        emailUpdates: { type: Boolean, default: true },
        theme: { type: String, default: 'light' },
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
