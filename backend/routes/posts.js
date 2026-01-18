const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Profile = require('../models/Profile');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, content, imageUrl } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });

    const post = new Post({
      userId,
      username: profile?.username || user.email.split('@')[0],
      displayName: profile?.displayName || user.name,
      profilePicture: profile?.profilePicture || '',
      content: content || '',
      imageUrl: imageUrl || ''
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:postId/reply', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content, imageUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });

    const reply = {
      userId,
      username: profile?.username || user.email.split('@')[0],
      displayName: profile?.displayName || user.name,
      profilePicture: profile?.profilePicture || '',
      content: content || '',
      imageUrl: imageUrl || ''
    };

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { replies: reply } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userIndex = post.likedBy.indexOf(userId);
    if (userIndex === -1) {
      post.likedBy.push(userId);
      post.likes = post.likedBy.length;
    } else {
      post.likedBy.splice(userIndex, 1);
      post.likes = post.likedBy.length;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;