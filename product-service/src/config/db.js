// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import getSecret from '../services/getSecret.js';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const getSecret = require('../services/getSecret');

dotenv.config();

dotenv.config();

const connectDB = async () => {
  try {
    const uri = await getSecret('MONGO_URI');
   
    const dbName = 'product-catelog'; 
    const fullUri = `${uriBase}/${dbName}?retryWrites=true&w=majority`;
    console.log('[MongoDB] Connecting to:', fullUri);
    await mongoose.connect(fullUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[MongoDB] Connected successfully to host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
// export default connectDB;
