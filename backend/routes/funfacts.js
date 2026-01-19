const express = require('express');
const FunFact = require('../models/FunFact');
const User = require('../models/User');
const Profile = require('../models/Profile');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const facts = await FunFact.find().sort({ createdAt: -1 });
    res.json(facts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, title, content, category } = req.body;
    
    if (!userId || !title || !content || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });

    const fact = new FunFact({
      title,
      content,
      category,
      user: userId,
      username: profile?.username || user.email.split('@')[0],
      displayName: profile?.displayName || user.name
    });

    await fact.save();
    res.status(201).json(fact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;