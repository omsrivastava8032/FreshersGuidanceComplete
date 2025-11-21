import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    label: { type: String, required: true },
    checked: { type: Boolean, default: false },
});

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'rejected'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    category: {
        type: String,
        required: true,
    },
    targetDate: {
        type: Date,
    },
    progress: {
        type: Number,
        default: 0,
    },
    tasks: [taskSchema],
    reviewedBy: {
        type: String,
    },
    reviewedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
