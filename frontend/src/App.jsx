import { useState, useEffect } from 'react';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  if (!isLoggedIn) return <SignupPage onLogin={() => setIsLoggedIn(true)} />;
  return <ProfilePage />;
}

export default App;