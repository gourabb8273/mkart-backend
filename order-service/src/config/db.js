import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getSecret from '../services/getSecret.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uriBase = await getSecret('MONGO_URI');
    const dbName = 'product-order'; 
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

export default connectDB;
