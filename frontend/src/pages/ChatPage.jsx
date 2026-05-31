
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function ChatPage({ match, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);
    newSocket.emit('join', currentUser.id);
    
    loadMessages();
    
    // Listen for incoming messages from others
    newSocket.on('receive_message', (msg) => {
      console.log('Received:', msg);
      setMessages(prev => [...prev, msg]);
    });
    
    // When message is sent successfully, add to local state
    newSocket.on('message_sent', (data) => {
      console.log('Message sent confirmation:', data);
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    });
    
    return () => newSocket.close();
  }, [match.match_id]);

  const loadMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/messages/${match.match_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageData = {
      matchId: match.match_id,
      senderId: currentUser.id,
      receiverId: match.user_id,
      message: newMessage
    };
    
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', height: '80vh', display: 'flex', flexDirection: 'column', padding: 20 }}>
      <button onClick={onBack} style={{ width: 80, marginBottom: 10, padding: 8, cursor: 'pointer' }}>← Back</button>
      <h2>Chat with {match.name}</h2>
      
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ddd', padding: 20, borderRadius: 10, background: '#f9f9f9' }}>
        {messages.length === 0 && <p>No messages yet. Say hello!</p>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            textAlign: msg.sender_id === currentUser.id ? 'right' : 'left', 
            marginBottom: 15 
          }}>
            <div style={{ 
              background: msg.sender_id === currentUser.id ? '#4CAF50' : '#ddd', 
              color: msg.sender_id === currentUser.id ? 'white' : 'black',
              padding: '10px 15px', 
              borderRadius: 20,
              display: 'inline-block',
              maxWidth: '70%'
            }}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} style={{ display: 'flex', marginTop: 10, gap: 10 }}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
          style={{ flex: 1, padding: 12, borderRadius: 25, border: '1px solid #ddd' }} 
        />
        <button type="submit" style={{ padding: '12px 25px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 25 }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
