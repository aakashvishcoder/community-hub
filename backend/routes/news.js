const express = require('express');
const News = require('../models/News');
const User = require('../models/User');
const Profile = require('../models/Profile');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = { city: 'McKinney, Texas' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    const news = await News.find(filter).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, title, date, category, excerpt, content, image, featured } = req.body;
    
    if (!userId || !title || !date || !category || !excerpt || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });

    const news = new News({
      title,
      date: new Date(date),
      category,
      excerpt,
      content,
      image: image || '',
      featured: Boolean(featured),
      user: userId,
      username: profile?.username || user.email.split('@')[0],
      displayName: profile?.displayName || user.name,
      profilePicture: profile?.profilePicture || '',
      city: 'McKinney, Texas'
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;