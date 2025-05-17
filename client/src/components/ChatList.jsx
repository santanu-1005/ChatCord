import React from 'react';
import Avatar  from './Avatar';
import { formatTime, truncateText } from '../utils';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  return (
    // Container for the list of chats, with vertical spacing between items
    <div className="space-y-1">
      {chats.map((chat) => {
        // Get the other participant (not the current user) for direct chats
        const otherParticipant = chat.isGroupChat
          ? null
          : chat.participants.find(p => p.id !== '1'); // '1' = current user ID (hardcoded)

        // Determine what name, avatar, and status to show
        const displayName = chat.isGroupChat
          ? chat.name
          : otherParticipant?.name;

        const avatar = chat.isGroupChat
          ? undefined
          : otherParticipant?.avatar;

        const status = chat.isGroupChat
          ? undefined
          : otherParticipant?.status;

        return (
          // Chat item wrapper
          <div
            key={chat.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              activeChat?.id === chat.id
                ? 'bg-indigo-50 border-l-4 border-indigo-500' // Highlight active chat
                : 'hover:bg-gray-50' // Hover effect
            }`}
            onClick={() => onChatSelect(chat)} // Call parent handler on click
          >
            {/* Avatar component (either image or initials) */}
            <Avatar
              src={avatar}
              name={displayName || 'Unknown'}
              status={status}

            />

            {/* Chat preview content */}
            <div className="ml-3 flex-1 overflow-hidden">
              {/* Top row: Name and last message timestamp */}
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatTime(chat.lastMessage.timestamp)} {/* Time of last message */}
                  </span>
                )}
              </div>

              {/* Bottom row: Last message preview and unread badge */}
              <div className="flex justify-between items-center">
                {chat.lastMessage ? (
                  <p className="text-xs text-gray-500 truncate">
                    {truncateText(chat.lastMessage.content, 30)} {/* Shortened message */}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">No messages yet</p>
                )}

                {/* Unread message badge */}
                {chat.unreadCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;