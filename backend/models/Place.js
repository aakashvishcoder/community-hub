const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['Education', 'Health', 'Food', 'Park', 'Library', 'Museum', 'Community Center', 'Other']
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  hours: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Place', PlaceSchema);