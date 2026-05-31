
import { useState, useEffect } from 'react';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SwipePage from './pages/SwipePage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('swipe');
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      checkProfileComplete();
    }
  }, []);

  const checkProfileComplete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/api/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const user = await response.json();
      if (user && user.niche && user.follower_range && user.bio) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      setHasProfile(false);
    }
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    setHasProfile(false);
    setCurrentPage('profile');
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
    setCurrentPage('swipe');
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setCurrentPage('chat');
  };

  const handleBackFromChat = () => {
    setSelectedMatch(null);
    setCurrentPage('matches');
  };

  if (!isLoggedIn) {
    return <SignupPage onSignupSuccess={handleSignupSuccess} />;
  }

  if (!hasProfile) {
    return <ProfilePage onProfileComplete={handleProfileComplete} />;
  }

  if (currentPage === 'chat' && selectedMatch) {
    return <ChatPage match={selectedMatch} onBack={handleBackFromChat} />;
  }

  return (
    <div>
      <nav style={{ background: '#333', padding: '10px', textAlign: 'center' }}>
        <button 
          onClick={() => setCurrentPage('swipe')} 
          style={{ margin: '0 10px', padding: '10px 20px', background: currentPage === 'swipe' ? '#4CAF50' : '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Swipe
        </button>
        <button 
          onClick={() => setCurrentPage('matches')} 
          style={{ margin: '0 10px', padding: '10px 20px', background: currentPage === 'matches' ? '#4CAF50' : '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Matches
        </button>
        <button 
          onClick={() => setCurrentPage('profile')} 
          style={{ margin: '0 10px', padding: '10px 20px', background: currentPage === 'profile' ? '#4CAF50' : '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Profile
        </button>
      </nav>
      
      {currentPage === 'swipe' && <SwipePage />}
      {currentPage === 'matches' && <MatchesPage onSelectMatch={handleSelectMatch} />}
      {currentPage === 'profile' && <ProfilePage onProfileComplete={() => setCurrentPage('swipe')} />}
    </div>
  );
}

export default App;
