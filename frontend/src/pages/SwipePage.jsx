
import { useState, useEffect } from 'react';

function SwipePage() {
  const [creators, setCreators] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5001/api/swipe/creators', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setCreators(data);
    setLoading(false);
  };

  const handleSwipe = async (swipeType) => {
    if (currentIndex >= creators.length) return;
    
    const currentCreator = creators[currentIndex];
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5001/api/swipe/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        swipedId: currentCreator.id,
        swipeType: swipeType
      })
    });
    
    const result = await response.json();
    
    if (result.isMatch) {
      setMessage(`🎉 It's a match with ${currentCreator.name}! 🎉`);
      setTimeout(() => setMessage(''), 3000);
    }
    
    setCurrentIndex(currentIndex + 1);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading creators...</div>;
  
  if (currentIndex >= creators.length) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>No more creators to show!</h2>
        <p>Check back later for new creators.</p>
        <button onClick={() => { setCurrentIndex(0); fetchCreators(); }} style={{ padding: '10px 20px' }}>
          Refresh
        </button>
      </div>
    );
  }

  const currentCreator = creators[currentIndex];

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      {message && (
        <div style={{ background: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
          {message}
        </div>
      )}
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '10px', 
        padding: '30px', 
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        background: 'white'
      }}>
        <h2>{currentCreator.name}</h2>
        <p><strong>Niche:</strong> {currentCreator.niche || 'Not set'}</p>
        <p><strong>Followers:</strong> {currentCreator.follower_range || 'Not set'}</p>
        <p><strong>Bio:</strong> {currentCreator.bio || 'No bio yet'}</p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button 
          onClick={() => handleSwipe('pass')}
          style={{ padding: '15px 30px', fontSize: '18px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          👎 Pass
        </button>
        <button 
          onClick={() => handleSwipe('like')}
          style={{ padding: '15px 30px', fontSize: '18px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          👍 Like
        </button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {currentIndex + 1} / {creators.length}
      </p>
    </div>
  );
}

export default SwipePage;
