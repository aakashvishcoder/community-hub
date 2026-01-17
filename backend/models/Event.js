const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            enum: [
                // subject to change
                'Market',
                'Festival',
                'Concert',
                'Workshop',
                'Community',
                'Other',
            ],
        },
        image: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

EventSchema.index({ date: 1});
EventSchema.index({ category: 1});
EventSchema.index({ user: 1});

module.exports = mongoose.model('Event', EventSchema);