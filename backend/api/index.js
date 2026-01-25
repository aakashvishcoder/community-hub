const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB().catch(console.error);

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://community-hub-nine-topaz.vercel.app',
    'https://community-hub-o2l4.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('../routes/auth'));
app.use('/api/profiles', require('../routes/profiles'));
app.use('/api/places', require('../routes/places'));
app.use('/api/news', require('../routes/news'));
app.use('/api/events', require('../routes/events'));
app.use('/api/posts', require('../routes/posts'));
app.use('/api/funfacts', require('../routes/funfacts'));

app.get('/', (req, res) => {
  res.json({ message: 'Community Resource Hub API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
