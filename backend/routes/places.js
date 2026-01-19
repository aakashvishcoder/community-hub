const express = require('express');
const Place = require('../models/Place');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    
    if (category && category !== 'all') {

      const decodedCategory = decodeURIComponent(category);
      filter.type = decodedCategory;
    }
    
    const places = await Place.find(filter).sort({ name: 1 });
    res.json(places);
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
      hours: hours || '',
      website: website || '',
      image: image || ''
    });

    await place.save();
    res.status(201).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;