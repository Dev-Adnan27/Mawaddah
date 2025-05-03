'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const SingleChat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;

    setMessages((prev) => [
      ...prev,
      { text: input, sender: 'me', timestamp: new Date().toLocaleTimeString() },
    ]);
    setInput('');
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-black">
        <h2>Select a chat to start messaging</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white text-white h-[88vh]">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-black border-b border-gray-700">
        <Image
          src={selectedChat.src.medium}
          alt={selectedChat.photographer}
          width={40}
          height={40}
          className="rounded-full h-14 w-14"
        />
        <h3 className="ml-3 text-lg text-white">{selectedChat.photographer}</h3>
      </div>

      {/* Chat Messages */}
      <div className="ChatSidebar flex-1 p-4 space-y-4 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'me' ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              <p className="text-white">{msg.text}</p>
              <span className="text-xs text-gray-300 ml-2">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-black border-t border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded-lg text-white outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
