import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './src/config/database.js';
import { createUsersTable } from './src/models/User.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test database connection
/// Test database connection (MySQL compatible)
app.get('/api/test-db', async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT NOW() as time');
    res.json({ message: 'Database connected!', time: result[0].time });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Test routes
app.get('/', (req, res) => {
  res.json({ message: "CollabConnect Backend is Running!" });
});

app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await createUsersTable();
    console.log('✅ Database initialized');
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();