
import { useState, useEffect } from 'react';

function ProfilePage({ onProfileComplete }) {
  const [user, setUser] = useState(null);
  const [niche, setNiche] = useState('');
  const [followerRange, setFollowerRange] = useState('');
  const [bio, setBio] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
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
      body: JSON.stringify({ niche, followerRange, bio, instagramHandle })
    });
    
    const result = await response.json();
    if (result.message) {
      setMessage('✅ Profile updated! Redirecting...');
      setTimeout(() => {
        if (onProfileComplete) onProfileComplete();
      }, 1500);
    } else {
      setMessage('❌ Error: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
      <h2>Complete Your Profile</h2>
      <p>Welcome, {user?.name}!</p>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Fill out your profile to find collaboration partners</p>
      
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 'bold' }}>Instagram Handle</label>
        <input
          type="text"
          placeholder="@yourusername"
          value={instagramHandle}
          onChange={(e) => setInstagramHandle(e.target.value)}
          style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '10px', border: '1px solid #ddd' }}
        />
        <small style={{ color: '#666', display: 'block', marginBottom: '20px' }}>Your Instagram handle will be visible to other creators</small>

        <label style={{ fontWeight: 'bold' }}>Niche *</label>
        <select value={niche} onChange={(e) => setNiche(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '10px', border: '1px solid #ddd' }} required>
          <option value="">Select Niche...</option>
          <option value="Gaming">🎮 Gaming</option>
          <option value="Tech">💻 Tech</option>
          <option value="Cooking">🍳 Cooking</option>
          <option value="Fashion">👗 Fashion</option>
          <option value="Fitness">💪 Fitness</option>
          <option value="Music">🎵 Music</option>
          <option value="Education">📚 Education</option>
          <option value="Travel">✈️ Travel</option>
          <option value="Art">🎨 Art</option>
          <option value="Photography">📷 Photography</option>
        </select>

        <label style={{ fontWeight: 'bold' }}>Follower Range *</label>
        <select value={followerRange} onChange={(e) => setFollowerRange(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '10px', border: '1px solid #ddd' }} required>
          <option value="">Select Range...</option>
          <option value="1k-10k">1,000 - 10,000</option>
          <option value="10k-50k">10,000 - 50,000</option>
          <option value="50k-100k">50,000 - 100,000</option>
          <option value="100k-500k">100,000 - 500,000</option>
          <option value="500k+">500,000+</option>
        </select>

        <label style={{ fontWeight: 'bold' }}>Bio *</label>
        <textarea 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
          placeholder="Tell others about yourself..." 
          style={{ width: '100%', padding: '12px', margin: '10px 0', minHeight: '100px', borderRadius: '10px', border: '1px solid #ddd' }} 
          required 
        />

        <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile & Continue'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', textAlign: 'center', padding: '10px', background: message.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '10px', color: message.includes('✅') ? '#155724' : '#721c24' }}>{message}</p>}
    </div>
  );
}

export default ProfilePage;