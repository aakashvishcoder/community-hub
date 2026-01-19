const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/places', require('./routes/places'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/events'));
app.use('/api/posts', require('./routes/posts')); 
app.use('/api/funfacts', require('./routes/funfacts'));

app.get('/', (req, res) => {
  res.json({ message: 'Community Resource Hub API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});