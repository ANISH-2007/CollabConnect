import { useState, useEffect } from 'react';

function ProfilePage({ onProfileComplete }) {
  const [user, setUser] = useState(null);
  const [niche, setNiche] = useState('');
  const [followerRange, setFollowerRange] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5001/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ niche, followerRange, bio })
    });
    
    const result = await response.json();
    if (result.message) {
      setMessage('✅ Profile updated! Redirecting to swipe...');
      setTimeout(() => {
        if (onProfileComplete) onProfileComplete();
      }, 1500);
    } else {
      setMessage('❌ Error: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Complete Your Profile</h2>
      <p>Welcome, {user?.name}!</p>
      <p style={{ color: '#666', marginBottom: '20px' }}>Please fill out your profile before finding collaboration partners.</p>
      
      <form onSubmit={handleSubmit}>
        <label>What's your niche?</label>
        <select
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        >
          <option value="">Select Niche...</option>
          <option value="Gaming">🎮 Gaming</option>
          <option value="Tech">💻 Tech</option>
          <option value="Cooking">🍳 Cooking</option>
          <option value="Fashion">👗 Fashion</option>
          <option value="Fitness">💪 Fitness</option>
          <option value="Music">🎵 Music</option>
          <option value="Education">📚 Education</option>
          <option value="Travel">✈️ Travel</option>
        </select>

        <label>Follower Range</label>
        <select
          value={followerRange}
          onChange={(e) => setFollowerRange(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        >
          <option value="">Select Follower Range...</option>
          <option value="1k-10k">1,000 - 10,000</option>
          <option value="10k-50k">10,000 - 50,000</option>
          <option value="50k-100k">50,000 - 100,000</option>
          <option value="100k-500k">100,000 - 500,000</option>
          <option value="500k+">500,000+</option>
        </select>

        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others about yourself..."
          style={{ width: '100%', padding: '10px', margin: '10px 0', minHeight: '100px' }}
          required
        />

        <button type="submit" style={{ width: '100%', padding: '10px' }} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile & Continue'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;