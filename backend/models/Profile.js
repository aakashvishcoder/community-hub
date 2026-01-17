const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    displayName: {
        type: String,
        required: false,
        trim: true,
    },
    bio: {
        type: String,
        required: false,
        trim: true,
    },
    profilePicture: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
});

ProfileSchema.index({ user: 1});

module.exports = mongoose.model("Profile", ProfileSchema);