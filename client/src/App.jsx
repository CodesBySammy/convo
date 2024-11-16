import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import LoginForm from './components/LoginForm';
import ChatRoom from './components/ChatRoom';

const App = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('userJoined', (username) => {
      setMessages(prev => [...prev, {
        text: `${username} joined the chat`,
        system: true,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('userLeft', (username) => {
      setMessages(prev => [...prev, {
        text: `${username} left the chat`,
        system: true,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userList');
    };
  }, []);

  const handleLogin = (username) => {
    socket.emit('join', username);
    setIsJoined(true);
  };

  const handleSendMessage = (text) => {
    socket.emit('message', { text });
  };

  if (!isJoined) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <ChatRoom
      messages={messages}
      users={users}
      onSendMessage={handleSendMessage}
    />
  );
};

export default App;