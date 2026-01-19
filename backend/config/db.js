const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    const conn = await mongoose.connect(MONGO_URI);
    cachedConnection = conn;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;