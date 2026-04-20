const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://rajendraprasad1705_db_user:Rajendra123@amazon.67abvnn.mongodb.net/amazon');
    console.log('MongoDB connected successfully to amazon DB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

