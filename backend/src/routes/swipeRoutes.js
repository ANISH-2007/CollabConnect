
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get random creators to swipe on (excluding self and already swiped)
router.get('/creators', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    const query = `
      SELECT u.id, u.name, u.email, u.niche, u.follower_range, u.bio
      FROM users u
      WHERE u.id != ? 
      AND u.id NOT IN (
        SELECT swiped_id FROM swipes WHERE swiper_id = ?
      )
      ORDER BY RAND()
      LIMIT 10
    `;
    
    const [rows] = await pool.execute(query, [userId, userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Record a swipe (like or pass)
router.post('/record', verifyToken, async (req, res) => {
  try {
    const { swipedId, swipeType } = req.body;
    const swiperId = req.userId;
    
    // Check if already swiped
    const [existing] = await pool.execute(
      'SELECT id FROM swipes WHERE swiper_id = ? AND swiped_id = ?',
      [swiperId, swipedId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already swiped on this user' });
    }
    
    // Record the swipe
    await pool.execute(
      'INSERT INTO swipes (swiper_id, swiped_id, swipe_type) VALUES (?, ?, ?)',
      [swiperId, swipedId, swipeType]
    );
    
    // Check if it's a match (both liked each other)
    let isMatch = false;
    if (swipeType === 'like') {
      const [checkMatch] = await pool.execute(
        'SELECT id FROM swipes WHERE swiper_id = ? AND swiped_id = ? AND swipe_type = "like"',
        [swipedId, swiperId]
      );
      
      if (checkMatch.length > 0) {
        isMatch = true;
        
        // Create match record
        await pool.execute(
          `INSERT INTO matches (user1_id, user2_id, status) 
           VALUES (?, ?, 'active')`,
          [swiperId, swipedId]
        );
      }
    }
    
    res.json({ success: true, isMatch, message: isMatch ? 'It\'s a match!' : 'Swipe recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
