import express from 'express';
import mongoose from 'mongoose';
import eventRoutes from './src/routes/eventRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evently';

// Middleware
app.use(express.json());

// Routes
app.use('/api', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
