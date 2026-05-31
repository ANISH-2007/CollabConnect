
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all matches for current user
router.get('/matches', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const query = `
      SELECT 
        m.id as match_id,
        m.created_at as matched_at,
        CASE 
          WHEN m.user1_id = ? THEN u2.id
          ELSE u1.id
        END as user_id,
        CASE 
          WHEN m.user1_id = ? THEN u2.name
          ELSE u1.name
        END as name,
        CASE 
          WHEN m.user1_id = ? THEN u2.niche
          ELSE u1.niche
        END as niche,
        CASE 
          WHEN m.user1_id = ? THEN u2.follower_range
          ELSE u1.follower_range
        END as follower_range
      FROM matches m
      JOIN users u1 ON m.user1_id = u1.id
      JOIN users u2 ON m.user2_id = u2.id
      WHERE (m.user1_id = ? OR m.user2_id = ?) AND m.status = 'active'
    `;
    const [rows] = await pool.execute(query, [userId, userId, userId, userId, userId, userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a specific match
router.get('/messages/:matchId', verifyToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const query = `SELECT * FROM messages WHERE match_id = ? ORDER BY created_at ASC`;
    const [rows] = await pool.execute(query, [matchId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
