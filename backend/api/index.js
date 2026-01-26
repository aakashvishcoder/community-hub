const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../config/db');

const app = express();

connectDB().catch((err) => {
  console.error(err);
  process.exit(1);
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', require('../routes/auth'));
app.use('/api/profiles', require('../routes/profiles'));
app.use('/api/places', require('../routes/places'));
app.use('/api/news', require('../routes/news'));
app.use('/api/events', require('../routes/events'));
app.use('/api/posts', require('../routes/posts'));
app.use('/api/funfacts', require('../routes/funfacts'));

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Community Resource Hub API running',
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong',
    message: err.message
  });
});

module.exports = app;
