'use client';
import React from 'react';
import Image from 'next/image';

const ChatSidebar = ({ data = [], setSelectedChat, activeItem }) => {
  return (
    <div className="ChatSidebar w-full md:w-80 h-[88vh] overflow-y-auto bg-black text-white p-4 border-r border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedChat && setSelectedChat(item)}
            className={`flex items-center p-3 rounded-lg hover:bg-[var(--col1)] cursor-pointer transition-all ${
              item === activeItem ? 'bg-[var(--col1)]' : ''
            }`}
          >
            {/* Profile Image */}
            <div className="relative w-12 h-12">
              {item.src?.medium ? (
                <Image
                  src={item.src.medium}
                  alt={item.photographer || 'Chat user'}
                  width={48}
                  height={48}
                  className="rounded-full h-full w-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white">
                  N/A
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="ml-3 flex-1">
              <h3 className="font-medium text-white">{item.photographer || 'Unknown'}</h3>
              <p className="text-sm text-gray-300 truncate w-48">
                {item.alt || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
