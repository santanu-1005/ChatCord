const Message = require('../models/messageModel');

// ✅ Get all messages between the logged-in user and another user
exports.getMessagesWithUser = async (req, res) => {
  const userId = req.params.userId;        // other user
  const senderId = req.user.id;            // current user from token
    // console.log(userId);
    // console.log(senderId);
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: userId },
        { sender: userId, recipient: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// ✅ Send a message to another user
exports.sendMessageToUser = async (req, res) => {
  const recipientId = req.params.recipientId;
  const senderId = req.user.id;            // current user from token
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    const newMessage = await Message.create({
      sender: senderId,
      recipient: recipientId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// ✅ Get users the logged-in user has messaged
exports.getInteractedUsers = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate("sender recipient", "name email image");

    // Extract unique user IDs
    const interactedUsersMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.sender._id.toString() === userId
        ? msg.recipient
        : msg.sender;
      interactedUsersMap.set(otherUser._id.toString(), otherUser);
    });

    res.status(200).json(Array.from(interactedUsersMap.values()));
  } catch (error) {
    console.error("Error fetching interacted users:", error);
    res.status(500).json({ error: "Could not get interacted users" });
  }
};
