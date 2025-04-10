import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getSecretValue from '../services/getSecret.js';
dotenv.config();

const isLocal = process.env.NODE_ENV === 'development' || !process.env.AWS_ACCESS_KEY_ID;
// const uri = process.env.MONGO_URI;
// if (!uri) {
//   console.error("Missing MONGO_URI in environment variables");
//   process.exit(1);
// }


const getMongoUri = async () => {
  if (isLocal) {
    // If local, fallback to the .env value
    console.log('Using local MongoDB URI from .env');
    return process.env.MONGO_URI; // Fallback to .env
  } else {
    // If not local, fetch the MongoDB URI from AWS Secrets Manager
    try {
      const secretString = await getSecretValue('MONGO_URI');
      if (secretString) {
        return JSON.parse(secretString).MONGO_URI; // Assume the secret is a JSON object with the key 'MONGO_URI'
      } else {
        throw new Error("Secret not found.");
      }
    } catch (error) {
      console.error("Error fetching MongoDB URI from Secrets Manager:", error);
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
