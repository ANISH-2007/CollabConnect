import { useState } from 'react';
import { signup } from '../services/api';

function SignupPage({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(name, email, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setMessage('✅ Signup successful!');
      setTimeout(() => onLogin(), 1000);
    } else {
      setMessage('❌ Error: ' + result.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Signup - CollabConnect</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignupPage;