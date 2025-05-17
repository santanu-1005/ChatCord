const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Send a message
const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.user;  // The sender is the logged-in user

  try {
    // Validate chatId exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({ message: 'Chat not found' });
    }

    // Create the message
    const newMessage = new Message({
      chatId,
      senderId,
      content,
    });

    // Save the message
    const savedMessage = await newMessage.save();

    // Return the saved message as a response
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get messages by chatId
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch all messages for a specific chat
    const messages = await Message.find({ chatId })
      .populate('senderId', 'username')  // Populate sender info
      .sort('timestamp');  // Sort messages by timestamp

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Update message status (sent, delivered, read)
const updateMessageStatus = async (req, res) => {
  const { messageId } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    if (!['sent', 'delivered', 'read'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the message
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status' });
  }
};

module.exports = { sendMessage, getMessages, updateMessageStatus };
