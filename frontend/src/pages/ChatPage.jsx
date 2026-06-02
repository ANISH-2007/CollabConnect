
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { FiSend, FiArrowLeft, FiUser, FiClock, FiCheck } from 'react-icons/fi';

function ChatPage({ match, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Connect to socket
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);
    newSocket.emit('join', currentUser.id);
    
    // Load previous messages
    loadMessages();
    
    // Listen for incoming messages from other user
    newSocket.on('receive_message', (msg) => {
      console.log('Received message:', msg);
      setMessages(prev => [...prev, msg]);
    });
    
    // Listen for message sent confirmation (adds your message to chat)
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
      console.error('Error loading messages:', error);
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
    
    console.log('Sending message:', messageData);
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', padding: '20px', display: 'flex', alignItems: 'center', gap: 15 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'white' }}>
          <FiArrowLeft />
        </button>
        <div style={{ width: 50, height: 50, background: 'white', borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          <FiUser />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: 20 }}>{match.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0 0', fontSize: 12 }}>{match.niche} • {match.follower_range}</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginTop: 50 }}>
            No messages yet. Say hello!
          </div>
        )}
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              display: 'flex', 
              justifyContent: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start', 
              marginBottom: 15 
            }}
          >
            <div style={{ maxWidth: '70%' }}>
              <div style={{
                background: msg.sender_id === currentUser.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
                color: msg.sender_id === currentUser.id ? '#667eea' : 'white',
                padding: '12px 18px',
                borderRadius: msg.sender_id === currentUser.id ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                backdropFilter: 'blur(10px)',
                wordBreak: 'break-word'
              }}>
                {msg.message}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5, justifyContent: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start' }}>
                <FiClock size={10} />
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.sender_id === currentUser.id && <FiCheck size={10} />}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '15px 20px', borderRadius: 30, border: 'none', outline: 'none', fontSize: 14, background: 'rgba(255,255,255,0.9)' }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          style={{ width: 50, height: 50, borderRadius: 25, border: 'none', background: 'white', color: '#667eea', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FiSend size={20} />
        </motion.button>
      </form>
    </div>
  );
}

export default ChatPage;
