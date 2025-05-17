const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Emit a message when a new user joins
    socket.emit('message', 'Welcome to the chat app!');

    // Listen for new messages from clients
    socket.on('sendMessage', (message) => {
      console.log('Message received:', message);
      io.emit('receiveMessage', message);  // Broadcast the message to all clients
    });

    // Listen for disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

module.exports = initSocket;
