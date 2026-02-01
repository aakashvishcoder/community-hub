const express = require('express');
const News = require('../models/News');
const User = require('../models/User');
const Profile = require('../models/Profile');
let fetchFn;
try {
  fetchFn = fetch;
} catch (e) {
  fetchFn = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const router = express.Router();

router.get('/external', async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY) {
      return res.status(500).json({ message: 'News API key not set on server' });
    }

    const { search, category } = req.query;
    let query = '("McKinney" OR "McKinney TX" OR "Dallas" OR "Dallas TX")';
    if (search && search.trim()) {
      query += ` AND (${search})`;
    }

    let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}`;

    const response = await fetchFn(url);
    const data = await response.json();
    if (data.status !== 'ok') {
      return res.status(502).json({ message: 'Failed to fetch external news', error: data });
    }

    let articles = data.articles.map(a => ({
      _id: a.url,
      title: a.title,
      excerpt: a.description || 'Click to read more',
      content: a.content,
      image: a.urlToImage,
      date: a.publishedAt,
      source: a.source.name,
      url: a.url,
      external: true
    }));

    res.json(articles);
  } catch (error) {
    console.error('External news error:', error);
    res.status(500).json({ message: 'Server error fetching external news' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = { city: { $in: ['McKinney, Texas', 'Dallas, Texas'] } };

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

router.get('/external', async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY) {
      return res.status(500).json({ message: 'News API key not set on server' });
    }

    const { search, category } = req.query;
    let query = '("Dallas" OR "Dallas TX")';
    if (search && search.trim()) {
      query += ` AND (${search})`;
    }

    let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}`;

    const response = await fetchFn(url);
    const data = await response.json();
    if (data.status !== 'ok') {
      return res.status(502).json({ message: 'Failed to fetch external news', error: data });
    }

    let articles = data.articles.map(a => ({
      _id: a.url,
      title: a.title,
      excerpt: a.description || 'Click to read more',
      content: a.content,
      image: a.urlToImage,
      date: a.publishedAt,
      source: a.source.name,
      url: a.url,
      external: true
    }));

    res.json(articles);
  } catch (error) {
    console.error('External news error:', error);
    res.status(500).json({ message: 'Server error fetching external news' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = { city: { $in: ['McKinney, Texas', 'Dallas, Texas'] } };

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
  }
});

// Create news article
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

// Get news by id
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


router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = { city: { $in: ['McKinney, Texas', 'Dallas, Texas'] } };

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
    router.get('/external', async (req, res) => {
      try {
        const NEWS_API_KEY = process.env.NEWS_API_KEY;
        if (!NEWS_API_KEY) {
          return res.status(500).json({ message: 'News API key not set on server' });
        }

        const { search, category } = req.query;
        let query = '("Dallas" OR "Dallas TX")';
        if (search && search.trim()) {
          query += ` AND (${search})`;
        }

        let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}`;

        const response = await fetchFn(url);
        const data = await response.json();
        if (data.status !== 'ok') {
          return res.status(502).json({ message: 'Failed to fetch external news', error: data });
        }

        let articles = data.articles.map(a => ({
          _id: a.url,
          title: a.title,
          excerpt: a.description || 'Click to read more',
          content: a.content,
          image: a.urlToImage,
          date: a.publishedAt,
          source: a.source.name,
          url: a.url,
          external: true
        }));

        res.json(articles);
      } catch (error) {
        console.error('External news error:', error);
        res.status(500).json({ message: 'Server error fetching external news' });
      }
    });

    module.exports = router;
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } 
});

module.exports = router;

router.get('/external', async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY) {
      return res.status(500).json({ message: 'News API key not set on server' });
    }

    const { search, category } = req.query;
    let query = '("Dallas" OR "Dallas TX")';
    if (search && search.trim()) {
      query += ` AND (${search})`;
    }

    let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}`;

    const response = await fetchFn(url);
    const data = await response.json();
    if (data.status !== 'ok') {
      return res.status(502).json({ message: 'Failed to fetch external news', error: data });
    }

    let articles = data.articles.map(a => ({
      _id: a.url,
      title: a.title,
      excerpt: a.description || 'Click to read more',
      content: a.content,
      image: a.urlToImage,
      date: a.publishedAt,
      source: a.source.name,
      url: a.url,
      external: true
    }));

    res.json(articles);
  } catch (error) {
    console.error('External news error:', error);
    res.status(500).json({ message: 'Server error fetching external news' });
  }
});