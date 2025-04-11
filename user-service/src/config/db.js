import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getSecretValue from '../services/getSecret.js';

dotenv.config();

const isLocal = !process.env.AWS_EXECUTION_ENV;

const getMongoUri = async () => {
  if (isLocal) {
    console.log('[MongoDB] Environment: LOCAL');
    console.log('[MongoDB] process.env.MONGO_URI:', process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      console.error('[MongoDB] Missing MONGO_URI in .env');
      process.exit(1);
    }

    return process.env.MONGO_URI;
  } else {
    console.log('[MongoDB] Environment: AWS (non-local)');
    try {
      const secretString = await getSecretValue('MONGO_URI');
      console.log('[MongoDB] Raw secret string from Secrets Manager:', secretString);

      const parsedSecret = JSON.parse(secretString);
      console.log('[MongoDB] Parsed secret object:', parsedSecret);

      let uri = parsedSecret.MONGO_URI;

      if (!uri) {
        throw new Error('MONGO_URI key not found in Secrets Manager response');
      }

      if (uri.startsWith('MONGO_URI=')) {
        console.warn('[MongoDB] MONGO_URI contains prefix "MONGO_URI=", stripping it...');
        uri = uri.replace(/^MONGO_URI=/, '');
      }

      console.log('[MongoDB] Final MongoDB URI:', uri);

      if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB URI format from Secrets Manager');
      }

      return uri;
    } catch (error) {
      console.error('[MongoDB] Error fetching MongoDB URI from Secrets Manager:', error.message);
      process.exit(1);
    }
  }
};

const connectDB = async () => {
  try {
    const uri = await getMongoUri();
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
