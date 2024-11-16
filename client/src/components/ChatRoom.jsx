import React from 'react';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = ({ messages, users, onSendMessage }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <UserList users={users} />
      <div className="flex-1 flex flex-col">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;