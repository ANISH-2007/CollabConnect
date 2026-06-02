
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setHasProfile(false);
    window.location.reload();
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
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        padding: '12px 20px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 15 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('swipe')}
              style={{
                padding: '10px 25px',
                fontSize: 14,
                fontWeight: 'bold',
                background: currentPage === 'swipe' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: currentPage === 'swipe' ? 'white' : '#667eea',
                border: 'none',
                borderRadius: 30,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <FiHeart /> Swipe
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('matches')}
              style={{
                padding: '10px 25px',
                fontSize: 14,
                fontWeight: 'bold',
                background: currentPage === 'matches' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: currentPage === 'matches' ? 'white' : '#667eea',
                border: 'none',
                borderRadius: 30,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <FiUsers /> Matches
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('profile')}
              style={{
                padding: '10px 25px',
                fontSize: 14,
                fontWeight: 'bold',
                background: currentPage === 'profile' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: currentPage === 'profile' ? 'white' : '#667eea',
                border: 'none',
                borderRadius: 30,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <FiUser /> Profile
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: 30,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14
            }}
          >
            <FiLogOut /> Logout
          </motion.button>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: 'calc(100vh - 70px)' }}>
        {currentPage === 'swipe' && <SwipePage />}
        {currentPage === 'matches' && <MatchesPage onSelectMatch={handleSelectMatch} />}
        {currentPage === 'profile' && <ProfilePage onProfileComplete={() => setCurrentPage('swipe')} />}
      </div>
    </div>
  );
}

export default App;
