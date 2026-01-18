const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.get('/', async (req, res) => {
  try {
    const { category, search, featuredOnly, limit = 20, skip = 0 } = req.query;
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featuredOnly === 'true') {
      filter.featured = true;
    }
    
    if (search) {
      const searchTerm = new RegExp(search, 'i');
      filter.$or = [
        { title: searchTerm },
        { excerpt: searchTerm },
        { content: searchTerm }
      ];
    }

    const news = await News.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await News.countDocuments(filter);
    
    res.json({
      news,
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
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, category, excerpt, content, image, featured } = req.body;
    
    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({ message: 'Title, category, excerpt, and content are required' });
    }
    
    const article = new News({
      title,
      category,
      excerpt,
      content,
      image,
      featured: featured || false
    });
    
    await article.save();
    res.status(201).json(article);
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
    const article = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;