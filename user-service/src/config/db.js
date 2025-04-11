import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getSecretValue from '../services/getSecret.js';

dotenv.config();

//This is the correct check — works for ECS, Lambda, etc.
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
      const parsedSecret = JSON.parse(secretString);
      const uri = parsedSecret.MONGO_URI;

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
