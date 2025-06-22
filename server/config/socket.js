const { Server } = require('socket.io');
const Message = require('../models/messageModel');

// userId -> Set of socketIds
const userSocketMap = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  // Helper to emit to all sockets of a user
  const emitToUser = (userId, event, data) => {
    const socketSet = userSocketMap.get(userId);
    if (socketSet && socketSet.size > 0) {
      for (const sid of socketSet) {
        io.to(sid).emit(event, data);
      }
    }
  };

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Register user socket
    socket.on('register', (userId) => {
      console.log(`📥 Registering user: ${userId} to socket: ${socket.id}`);
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);
      socket.data.userId = userId;
    });

    // Send message handler
    socket.on('sendMessage', async ({ sender, recipient, message }) => {
      try {
        const newMessage = await Message.create({
          sender,
          recipient,
          message,
        });

        console.log(`💬 New message from ${sender} to ${recipient}: ${message}`);

        // Emit to recipient and sender
        emitToUser(recipient, 'receiveMessage', newMessage);
        emitToUser(sender, 'receiveMessage', newMessage);

      } catch (error) {
        console.error('❌ Error saving the message:', error);
        socket.emit('errorMessage', 'Failed to save message');
      }
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      console.log(`🔌 Socket disconnected: ${socket.id}`);

      if (userId && userSocketMap.has(userId)) {
        const sockets = userSocketMap.get(userId);
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          userSocketMap.delete(userId);
        }
      }
    });
  });

  return io;
};

module.exports = initSocket;
