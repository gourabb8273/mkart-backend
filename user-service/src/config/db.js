import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getSecret from '../services/getSecret.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = await getSecret('MONGO_URI');
    console.log('[MongoDB] Connecting to:', uri);

    await mongoose.connect(uri, {
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
