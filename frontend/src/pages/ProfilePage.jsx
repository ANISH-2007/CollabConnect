import { useState, useEffect } from 'react';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [niche, setNiche] = useState('');
  const [followerRange, setFollowerRange] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5001/api/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ niche, followerRange, bio })
    });
    const result = await response.json();
    setMessage(result.message ? '✅ Profile updated!' : '❌ Error: ' + result.error);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Complete Your Profile</h2>
      <p>Welcome, {user?.name}!</p>
      <form onSubmit={handleSubmit}>
        <select value={niche} onChange={(e) => setNiche(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required>
          <option value="">Select Niche...</option>
          <option value="Gaming">🎮 Gaming</option>
          <option value="Tech">💻 Tech</option>
          <option value="Cooking">🍳 Cooking</option>
          <option value="Fashion">👗 Fashion</option>
          <option value="Fitness">💪 Fitness</option>
          <option value="Music">🎵 Music</option>
        </select>
        <select value={followerRange} onChange={(e) => setFollowerRange(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required>
          <option value="">Select Follower Range...</option>
          <option value="1k-10k">1,000 - 10,000</option>
          <option value="10k-50k">10,000 - 50,000</option>
          <option value="50k-100k">50,000 - 100,000</option>
          <option value="100k-500k">100,000 - 500,000</option>
        </select>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell about yourself..." style={{ width: '100%', padding: '10px', margin: '10px 0', minHeight: '100px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Save Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;