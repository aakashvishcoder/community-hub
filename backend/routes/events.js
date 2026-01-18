const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, skip = 0 } = req.query;
    
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      const searchTerm = new RegExp(search, 'i');
      filter.$or = [
        { title: searchTerm },
        { description: searchTerm },
        { location: searchTerm }
      ];
    }

    filter.date = { $gte: new Date() };
    
    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await Event.countDocuments(filter);
    
    res.json({
      events,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit)
    });
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

router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      date, 
      time, 
      location, 
      description, 
      category, 
      image,
      user 
    } = req.body;

    if (!title || !date || !time || !location || !description || !category) {
      return res.status(400).json({ message: 'All fields except image and user are required' });
    }
    
    const event = new Event({
      title,
      date: new Date(date),
      time,
      location,
      description,
      category,
      image,
      user
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;