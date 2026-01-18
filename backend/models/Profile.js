const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  displayName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    trim: true
  },
  socials: {
    website: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

ProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('Profile', ProfileSchema);