import mongoose from 'mongoose';
import { log, logError } from '../utils/logger.js';

export const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    log('MongoDB connected');
  } catch (error) {
    logError('MongoDB connection failed');
    throw error;
  }
};
