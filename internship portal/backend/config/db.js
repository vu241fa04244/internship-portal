const mongoose = require('mongoose');

const connectDB = async (customUri) => {
  const uri = customUri || process.env.MONGO_URI;

  if (!uri) {
    console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
    throw new Error('MONGO_URI is missing. Please configure your .env file or environment variables.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Failed: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed successfully.');
  } catch (error) {
    console.error(`[MongoDB] Error closing connection: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
