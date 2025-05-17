import React, { useRef, useEffect, useMemo } from 'react';
import { CheckCheck, Check } from 'lucide-react';
import { formatTime, formatDate } from '../utils';

const MessageStatus = ({ status }) => {
  switch (status) {
    case 'sent':
      return <Check size={16} className="text-gray-400" />;
    case 'delivered':
      return <CheckCheck size={16} className="text-gray-400" />;
    case 'read':
      return <CheckCheck size={16} className="text-blue-500" />;
    default:
      return null;
  }
};

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupedMessages = useMemo(() => {
    const groups = {};
    messages?.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 flex items-center justify-center text-gray-500">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {Object.keys(groupedMessages).map(date => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-600">
              {date}
            </span>
          </div>
          {groupedMessages[date].map(message => {
            const isOwnMessage = message.senderId === currentUser?.id;

            return (
              <div 
                key={message.id}
                className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg px-4 py-2 max-w-[75%] ${
                    isOwnMessage 
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div 
                    className={`flex items-center justify-end mt-1 text-xs ${
                      isOwnMessage ? 'text-indigo-100' : 'text-gray-500'
                    }`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {isOwnMessage && (
                      <span className="ml-1">
                        <MessageStatus status={message.status} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
