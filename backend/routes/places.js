const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

router.get('/', async (req, res) => {
  try {
    const { type, search, limit = 20, skip = 0 } = req.query;
    
    let filter = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (search) {
      const searchTerm = new RegExp(search, 'i');
      filter.$or = [
        { name: searchTerm },
        { description: searchTerm },
        { address: searchTerm }
      ];
    }
    
    const places = await Place.find(filter)
      .sort({ name: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await Place.countDocuments(filter);
    
    res.json({
      places,
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
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, address, description, hours, website, image } = req.body;
    
    if (!name || !type || !address || !description) {
      return res.status(400).json({ message: 'Name, type, address, and description are required' });
    }
    
    const place = new Place({
      name,
      type,
      address,
      description,
      hours,
      website,
      image
    });
    
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;