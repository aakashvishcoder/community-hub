const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Data,
        required: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Community',
            'Resources',
            'Events',
            'Education'
        ],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    exerpt: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {
    required: true,
});

NewsSchema.index({ date: 1});
NewsSchema.index({ category: 1});
NewsSchema.index({ user: 1});

module.exports = mongoose.model('News', NewsSchema);