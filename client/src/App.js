import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://172.16.32.85:3001';
const socket = io(SOCKET_URL);

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Listen for messages
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Listen for user joined
    socket.on('userJoined', (username) => {
      setMessages(prev => [...prev, {
        text: `${username} joined the chat`,
        system: true,
        timestamp: new Date().toISOString()
      }]);
    });

    // Listen for user left
    socket.on('userLeft', (username) => {
      setMessages(prev => [...prev, {
        text: `${username} left the chat`,
        system: true,
        timestamp: new Date().toISOString()
      }]);
    });

    // Listen for user list updates
    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    // Cleanup on unmount
    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userList');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { text: message });
      setMessage('');
    }
  };

  // Login screen
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <form onSubmit={handleJoin} className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Join Chat</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Users sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Online Users</h2>
          <ul className="mt-2">
            {users.map((user, index) => (
              <li key={index} className="py-2">{user}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${msg.system ? 'text-center text-gray-500 text-sm' : ''}`}
            >
              {!msg.system && (
                <div className="flex items-start">
                  <div className="bg-white rounded-lg shadow p-3">
                    <div className="font-semibold">{msg.username}</div>
                    <div>{msg.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
              {msg.system && <div>{msg.text}</div>}
            </div>
          ))}
        </div>

        {/* Message input */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;