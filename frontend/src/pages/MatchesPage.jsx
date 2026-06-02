import { useState, useEffect } from 'react';

function MatchesPage({ onSelectMatch }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5001/api/matches', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setMatches(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>⏳</div>
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>💔</div>
          <h2>No matches yet</h2>
          <p>Keep swiping to find collaboration partners!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>Your Matches 🤝</h1>
      {matches.map(match => (
        <div
          key={match.match_id}
          onClick={() => onSelectMatch(match)}
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 15,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, boxShadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 15
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{match.name}</h3>
            <p style={{ margin: '5px 0 0', color: '#666' }}>
              {match.niche} • {match.follower_range}
            </p>
          </div>
          <div style={{ fontSize: 24 }}>💬</div>
        </div>
      ))}
    </div>
  );
}

export default MatchesPage;
