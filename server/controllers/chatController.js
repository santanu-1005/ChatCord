const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create a one-to-one chat
const createOneToOneChat = async (req, res) => {
  const { recipientId } = req.body; // The ID of the other user for a 1:1 chat
  const senderId = req.user; // The logged-in user (from authMiddleware)

  try {
    // Ensure senderId and recipientId are not the same user
    if (senderId.toString() === recipientId.toString()) {
      return res.status(400).json({ message: 'Cannot create a chat with yourself' });
    }

    // Check if the chat already exists between the sender and recipient
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
      type: 'private',  // 1:1 chat is considered private
    });

    if (existingChat) {
      return res.status(400).json({ message: 'A chat already exists between these users' });
    }

    // Create a new chat
    const newChat = new Chat({
      participants: [senderId, recipientId],
      type: 'private',
    });

    // Save the new chat
    await newChat.save();

    // Return the newly created chat
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating one-to-one chat', error });
  }
};

// Create a group chat
const createGroupChat = async (req, res) => {
  const { participants } = req.body; // Array of participant IDs
  const senderId = req.user; // The logged-in user (from authMiddleware)

  try {
    // Ensure the sender is included in the participants
    if (!participants.includes(senderId)) {
      participants.push(senderId);
    }

    // Ensure there are at least two participants in the group chat
    if (participants.length < 2) {
      return res.status(400).json({ message: 'A group chat must have at least two participants' });
    }

    // Create a new chat
    const newChat = new Chat({
      participants,
      type: 'group',
    });

    // Save the new chat
    await newChat.save();

    // Return the newly created group chat
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group chat', error });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.user; // The logged-in user (from authMiddleware)

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create a new message
    const newMessage = new Message({
      chatId,
      senderId,
      content,
    });

    // Save the new message
    await newMessage.save();

    // Return the newly created message
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Get all messages in a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Get all messages in the chat
    const messages = await Message.find({ chatId })
      .populate('senderId', 'username')  // Populate sender user details
      .sort('timestamp');  // Sort by timestamp (ascending)

    // Return all messages
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

module.exports = {
  createOneToOneChat,
  createGroupChat,
  sendMessage,
  getMessages,
};
