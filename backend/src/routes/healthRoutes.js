import express from 'express';
import mongoose from 'mongoose';
import geminiService from '../services/geminiService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    success: true,
    message: 'AgroMind AI backend is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      name: mongoose.connection.name || 'none',
    },
    aiEngine: {
      provider: geminiService.isConfigured() ? 'Google Gemini (@google/genai)' : 'Agronomic Expert Engine',
      geminiConfigured: geminiService.isConfigured(),
      model: geminiService.modelName,
    },
  });
});

export default router;
