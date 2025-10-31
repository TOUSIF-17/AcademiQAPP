import { connect, connection } from 'mongoose';

// For development, use local MongoDB instance or fallback to in-memory
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academiq-dev';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Continuing without database connection...');
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return null;
  }

  return cached.conn;
}

export default connectDB;