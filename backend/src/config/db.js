import mongoose from 'mongoose';

let memoryServerInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB via URI...');
      await mongoose.connect(uri);
      console.log(' MongoDB connected successfully to database:', mongoose.connection.name);
      return mongoose.connection;
    } catch (error) {
      console.error(' Error connecting to configured MongoDB URI:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Production database connection failed: ${error.message}`);
      }
      console.warn('⚠️ Falling back to in-memory MongoDB for local development and testing...');
    }
  }

  // Development Fallback: In-Memory MongoDB Server if URI not provided or unreachable in dev
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = memoryServerInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(' Connected to In-Memory MongoDB for local development/testing at:', memoryUri);
    console.log('ℹ️ Tip: Set MONGODB_URI in backend/.env to connect to your MongoDB Atlas cluster.');
    return mongoose.connection;
  } catch (memError) {
    console.error(' Critical Error: Failed to start MongoDB connection:', memError.message);
    throw new Error('Database connection failed. Please provide a valid MONGODB_URI in backend/.env.');
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};
