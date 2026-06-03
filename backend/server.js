import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pool from './src/config/database.js';
import { createUsersTable } from './src/models/User.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import swipeRoutes from './src/routes/swipeRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api', chatRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!" });
});

// Socket.io connection for real-time chat
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`✅ User ${userId} joined room user_${userId}`);
  });
  
  socket.on('send_message', async (data) => {
    const { matchId, senderId, receiverId, message } = data;
    
    try {
      const query = `
        INSERT INTO messages (match_id, sender_id, message)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.execute(query, [matchId, senderId, message]);
      
      const newMessage = {
        id: result.insertId,
        match_id: matchId,
        sender_id: senderId,
        message: message,
        created_at: new Date()
      };
      
      io.to(`user_${receiverId}`).emit('receive_message', newMessage);
      socket.emit('message_sent', { success: true, message: newMessage });
      
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message_error', { error: error.message });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await createUsersTable();
    console.log('✅ Database initialized');
    
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Socket.io ready for real-time chat`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();