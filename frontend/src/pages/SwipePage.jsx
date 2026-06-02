
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTimes, FaUsers, FaTag, FaInfoCircle } from 'react-icons/fa';

function SwipePage() {
  const [creators, setCreators] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(null);
  
  // HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

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
      body: JSON.stringify({ swipedId: currentCreator.id, swipeType: swipeType })
    });
    
    const result = await response.json();
    
    if (result.isMatch) {
      setShowMatch(currentCreator);
      setTimeout(() => setShowMatch(null), 4000);
    }
    
    setCurrentIndex(currentIndex + 1);
  };

  // CONDITIONAL RETURNS GO AFTER ALL HOOKS
  if (creators.length === 0 || currentIndex >= creators.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 70px)' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎯</div>
          <h2>No more creators!</h2>
          <p>Check back later for new creators</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setCurrentIndex(0); fetchCreators(); }} style={{ marginTop: 20, padding: '12px 30px', background: 'white', border: 'none', borderRadius: 30, cursor: 'pointer', fontWeight: 'bold', color: '#667eea' }}>
            Refresh
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentCreator = creators[currentIndex];

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {/* Match Popup */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '40px',
              borderRadius: 30,
              textAlign: 'center',
              zIndex: 1000,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              color: 'white'
            }}
          >
            <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
            <h2>It's a Match!</h2>
            <p>You and {showMatch.name} liked each other</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, opacity, width: '100%', maxWidth: 450 }}
        onDragEnd={(e, { offset }) => {
          if (offset.x > 100) handleSwipe('like');
          else if (offset.x < -100) handleSwipe('pass');
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div style={{
          background: 'white',
          borderRadius: 30,
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          cursor: 'grab'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              width: 100,
              height: 100,
              background: 'white',
              borderRadius: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: 50
            }}>👤</div>
            <h2 style={{ color: 'white', marginTop: 20, fontSize: 28 }}>{currentCreator.name}</h2>
          </div>
          
          <div style={{ padding: 30 }}>
            <div style={{ marginBottom: 20, padding: 15, background: '#f8f9fa', borderRadius: 15, display: 'flex', alignItems: 'center', gap: 15 }}>
              <FaTag color="#667eea" size={24} />
              <div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Niche</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{currentCreator.niche || 'Not set'}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: 20, padding: 15, background: '#f8f9fa', borderRadius: 15, display: 'flex', alignItems: 'center', gap: 15 }}>
              <FaUsers color="#667eea" size={24} />
              <div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Followers</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{currentCreator.follower_range || 'Not set'}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: 20, padding: 15, background: '#f8f9fa', borderRadius: 15, display: 'flex', alignItems: 'center', gap: 15 }}>
              <FaInfoCircle color="#667eea" size={24} />
              <div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Bio</div>
                <div style={{ fontSize: 14, color: '#333' }}>{currentCreator.bio || 'No bio yet'}</div>
              </div>
            </div>
            
            {currentCreator.instagram_handle && (
              <div style={{ marginBottom: 20, padding: 15, background: '#f8f9fa', borderRadius: 15, display: 'flex', alignItems: 'center', gap: 15 }}>
                <span style={{ fontSize: 24 }}>📸</span>
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Instagram</div>
                  <a 
                    href={`https://instagram.com/${currentCreator.instagram_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#E4405F', textDecoration: 'none' }}
                  >
                    {currentCreator.instagram_handle}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Action Buttons */}
      <div style={{ position: 'fixed', bottom: 30, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30 }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('pass')}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaTimes size={30} color="#ff4757" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('like')}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaHeart size={30} color="#4CAF50" />
        </motion.button>
      </div>
    </div>
  );
}

export default SwipePage;
