import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 ${msg.system ? 'text-center text-gray-500 text-sm' : ''}`}
        >
          {!msg.system && (
            <div className="flex items-start">
              <div className="bg-white rounded-lg shadow p-3">
                <div className="font-semibold">{msg.username}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
          {msg.system && <div>{msg.text}</div>}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
