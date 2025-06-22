import { Paperclip, SendHorizontalIcon, SmilePlusIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { userAppStore } from '../../../../../../store';
import { SEND_MESSAGE_TO_USER } from '../../../../../../utils/constants';
import { apiClient } from '../../../../../../services/api-client';

const MessageBar = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const {selectedChat, addMessage} = userAppStore();
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

  try {
    const url = SEND_MESSAGE_TO_USER.replace(':recipientId', selectedChat._id);
    const res = await apiClient.post(url, {message});
    console.log('Message sent:', res.data);
    addMessage(res.data);
    setMessage('');

    // Optionally: trigger message refresh or update locally
    console.log('Message sent');
  } catch (error) {
    console.error("Failed to send message:", error?.response?.data || error.message);
  }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center px-6 py-2 relative">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-4 px-4 py-2">
        <input
          type="text"
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-gray-400 hover:text-white transition">
          <Paperclip size={20} />
        </button>
        <div className="relative">
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-400 hover:text-white transition"
          >
            <SmilePlusIcon size={20} />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 right-0 z-50"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>
        <button
          onClick={handleSendMessage}
          className="text-blue-400 hover:text-blue-300 transition"
        >
          <SendHorizontalIcon size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
