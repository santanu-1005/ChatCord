const mongoose = require('mongoose');

// Define the schema for a Chat
const chatSchema = new mongoose.Schema(
    {
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        name: String, // Only needed for group chats
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        unreadCount: {
            type: Number,
            default: 0,
        },
    }, { timestamps: true }
);

// Export the model
module.exports = mongoose.model('Chat', chatSchema);
