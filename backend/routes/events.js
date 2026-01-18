const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const Profile = require('../models/Profile');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, title, date, time, location, description, category, image } = req.body;
    
    if (!userId || !title || !date || !time || !location || !description || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId });

    const event = new Event({
      title,
      date: new Date(date),
      time,
      location,
      description,
      category,
      image: image || '',
      user: userId,
      username: profile?.username || user.email.split('@')[0],
      displayName: profile?.displayName || user.name,
      profilePicture: profile?.profilePicture || ''
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;