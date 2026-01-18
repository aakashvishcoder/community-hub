require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb'}));

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});