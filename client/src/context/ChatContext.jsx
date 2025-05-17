import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Simulated other users
const mockUsers = [
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'online',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'away',
  },
];

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // 🔄 Load mock chats once current user is available
  useEffect(() => {
    if (!currentUser) return;

    const mockChats = [
      {
        id: '1',
        isGroupChat: false,
        participants: [currentUser, mockUsers[0]],
        lastMessage: {
          id: '1',
          content: 'Hey, how are you?',
          senderId: mockUsers[0].id,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'read',
        },
        unreadCount: 0,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        isGroupChat: false,
        participants: [currentUser, mockUsers[1]],
        lastMessage: {
          id: '2',
          content: 'Can we meet tomorrow?',
          senderId: mockUsers[1].id,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'delivered',
        },
        unreadCount: 1,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '3',
        name: 'Project Team',
        isGroupChat: true,
        participants: [currentUser, ...mockUsers],
        lastMessage: {
          id: '3',
          content: 'Let\'s discuss the new features',
          senderId: mockUsers[2].id,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          status: 'sent',
        },
        unreadCount: 3,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ];

    setChats(mockChats);
  }, [currentUser]);

  // 📩 Load messages when active chat is set
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const mockMessages = [
      {
        id: '101',
        content: 'Hey there!',
        senderId: activeChat.participants[1]?.id,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
      },
      {
        id: '102',
        content: 'Hi! How are you doing?',
        senderId: currentUser.id,
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        status: 'read',
      },
      {
        id: '103',
        content: 'I\'m good, thanks for asking!',
        senderId: activeChat.participants[1]?.id,
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        status: 'read',
      },
      {
        id: '104',
        content: 'Just working on some projects.',
        senderId: currentUser.id,
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        status: 'read',
      },
    ];

    setMessages(mockMessages);

    // Mark chat as read
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id ? { ...chat, unreadCount: 0 } : chat
      )
    );
  }, [activeChat, currentUser]);

  // 📤 Send message
  const sendMessage = useCallback((content) => {
    if (!activeChat || !currentUser) return;

    const newMessage = {
      id: Date.now().toString(),
      content,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update last message in chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, lastMessage: newMessage }
          : chat
      )
    );

    // Simulate delayed status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);
  }, [activeChat, currentUser]);

  // ➕ Create new chat
  const createChat = useCallback((participants, isGroupChat, name) => {
    if (!currentUser) return;

    const newChat = {
      id: Date.now().toString(),
      name,
      isGroupChat,
      participants: [currentUser, ...participants],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      lastMessage: null,
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
  }, [currentUser]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        setActiveChat,
        sendMessage,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
