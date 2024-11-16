const users = new Map();

const socketHandlers = (io, socket) => {
  console.log('User connected:', socket.id);

  const handleJoin = (username) => {
    users.set(socket.id, username);
    io.emit('userJoined', username);
    io.emit('userList', Array.from(users.values()));
  };

  const handleMessage = (data) => {
    const username = users.get(socket.id);
    io.emit('message', {
      text: data.text,
      username: username,
      timestamp: new Date().toISOString()
    });
  };

  const handleDisconnect = () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      io.emit('userLeft', username);
      io.emit('userList', Array.from(users.values()));
    }
  };

  socket.on('join', handleJoin);
  socket.on('message', handleMessage);
  socket.on('disconnect', handleDisconnect);
};

module.exports = socketHandlers;