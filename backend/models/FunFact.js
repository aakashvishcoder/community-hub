const mongoose = require('mongoose');

const FunFactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FunFact', FunFactSchema);