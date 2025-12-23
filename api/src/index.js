import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { log, logError } from './utils/logger.js';

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(env.mongoUri);
    app.listen(env.port, () => log(`API running on port ${env.port}`));
  } catch (error) {
    logError('Failed to start server', error.message);
    process.exit(1);
  }
};

start();
