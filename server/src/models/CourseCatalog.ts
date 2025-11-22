import mongoose from 'mongoose';

const courseCatalogSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    reviews: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const CourseCatalog = mongoose.model('CourseCatalog', courseCatalogSchema);

export default CourseCatalog;
