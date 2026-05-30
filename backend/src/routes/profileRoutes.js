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

router.put('/update', verifyToken, async (req, res) => {
  try {
    const { niche, followerRange, bio } = req.body;
    await pool.execute('UPDATE users SET niche = ?, follower_range = ?, bio = ? WHERE id = ?', [niche, followerRange, bio, req.userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, niche, follower_range, bio FROM users WHERE id = ?', [req.userId]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;