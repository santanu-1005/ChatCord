import React from 'react';
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react';
import  Avatar  from './Avatar';
import { getLastSeen } from '../utils';
import  Button  from './Button';

const ChatHeader = ({ chat, currentUser, onBackClick }) => {
  // For non-group chats, get the other participant
  const otherParticipant = chat.isGroupChat
    ? null
    : chat.participants.find(p => p.id !== currentUser?.id);

  const displayName = chat.isGroupChat
    ? chat.name
    : otherParticipant?.name;

  const avatar = chat.isGroupChat
    ? undefined
    : otherParticipant?.avatar;

  const status = chat.isGroupChat
    ? undefined
    : otherParticipant?.status;

  const statusText = otherParticipant?.status === 'online'
    ? 'Online'
    : otherParticipant?.lastSeen
      ? `Last seen ${getLastSeen(otherParticipant.lastSeen)}`
      : '';

  const participantCount = chat.isGroupChat
    ? `${chat.participants.length} participants`
    : '';

  return (
    <div className="p-3 border-b flex items-center bg-white">
      <Button
        variant="ghost"
        className="md:hidden p-2 rounded-full text-gray-500 hover:text-gray-700"
        onClick={onBackClick}
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="flex items-center flex-1">
        <Avatar
          src={avatar}
          name={displayName || 'Unknown'}
          status={status}
        />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{displayName}</h3>
          <p className="text-xs text-gray-500">
            {statusText || participantCount || ''}
          </p>
        </div>
      </div>

      <div className="flex space-x-1">
        <Button
          variant="ghost"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700"
        >
          <Phone size={20} />
        </Button>
        <Button
          variant="ghost"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700"
        >
          <Video size={20} />
        </Button>
        <Button
          variant="ghost"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700"
        >
          <MoreVertical size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;