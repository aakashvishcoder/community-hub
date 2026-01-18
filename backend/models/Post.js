const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  profilePicture: { type: String },
  content: { type: String },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  profilePicture: { type: String },
  content: { type: String },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [ReplySchema],
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);