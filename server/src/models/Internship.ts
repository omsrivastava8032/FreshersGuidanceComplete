import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true, // e.g., 'Full-time', 'Part-time', 'Remote'
    },
    tags: [{
        type: String,
    }],
    deadline: {
        type: Date,
        required: true,
    },
    logo: {
        type: String, // URL or initial
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
    },
    stipend: {
        type: String,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;
