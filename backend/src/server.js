import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
await connectDB();

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching origin
      if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌾 AgroMind AI API is live',
    documentation: '/api/health',
  });
});

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🌾 AgroMind AI Backend Server listening on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
});

export default app;
