import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getSecretValue from '../services/getSecret.js';

dotenv.config();

// Check if running locally (no AWS environment variable present)
const isLocal = !process.env.AWS_EXECUTION_ENV;

const getMongoUri = async () => {
  if (isLocal) {
    console.log('Using local MongoDB URI from .env');
    if (!process.env.MONGO_URI) {
      console.error("Missing MONGO_URI in environment variables");
      process.exit(1);
    }
    return process.env.MONGO_URI;
  } else {
    try {
      const secretString = await getSecretValue('MONGO_URI');

      let uri;

      try {
        const parsedSecret = JSON.parse(secretString);
        uri = parsedSecret.MONGO_URI;
      } catch {
        // Assume secret is a raw URI string
        uri = secretString;
      }

      if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
        throw new Error("Invalid MongoDB URI format from Secrets Manager");
      }

      return uri;
    } catch (error) {
      console.error("Error fetching MongoDB URI from Secrets Manager:", error.message);
      process.exit(1);
    }
  }
};

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); // Optional but prevents deprecation warning
    const uri = await getMongoUri();
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

export default connectDB;
