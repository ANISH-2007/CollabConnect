
import { useState, useEffect } from 'react';

function MatchesPage({ onSelectMatch }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/matches', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMatches(data));
  }, []);

  if (matches.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>No matches yet. Keep swiping!</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' }}>
      <h2>Your Matches 🤝</h2>
      {matches.map(match => (
        <div 
          key={match.match_id} 
          onClick={() => onSelectMatch(match)}
          style={{ 
            border: '1px solid #ddd', 
            padding: 15, 
            margin: 10, 
            borderRadius: 10, 
            cursor: 'pointer',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <h3>{match.name}</h3>
          <p>Niche: {match.niche}</p>
          <p>Followers: {match.follower_range}</p>
          <small>Matched on: {new Date(match.matched_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}

export default MatchesPage;
