
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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

// Fetch Instagram profile info using a different API
router.get('/fetch/:username', verifyToken, async (req, res) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.replace('@', '');
    
    // Try multiple API endpoints
    
    // Option 1: Instagram profile downloader API
    const options1 = {
      method: 'GET',
      url: 'https://instagram-profile-downloader-download-instagram-stories.p.rapidapi.com/index.php',
      params: { username: cleanUsername },
      headers: {
        'x-rapidapi-host': 'instagram-profile-downloader-download-instagram-stories.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    };
    
    try {
      const response = await axios.request(options1);
      if (response.data && response.data.user) {
        return res.json({
          success: true,
          fullName: response.data.user.full_name,
          bio: response.data.user.biography,
          followers: response.data.user.follower_count,
          following: response.data.user.following_count,
          profilePic: response.data.user.profile_pic_url_hd,
          posts: response.data.user.media_count
        });
      }
    } catch (err) {
      console.log('API 1 failed, trying API 2...');
    }
    
    // If API fails, return error
    res.json({ 
      success: false, 
      error: 'Could not fetch Instagram profile. Make sure the username is correct.' 
    });
    
  } catch (error) {
    console.error('Instagram API error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch Instagram profile' });
  }
});

export default router;
