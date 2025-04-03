const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGO_URI in environment variables");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
