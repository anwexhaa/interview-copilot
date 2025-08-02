'use client';

import { useSystemChat } from './SystemChatContext';

export default function SystemChatWindow() {
  const { messages, loading } = useSystemChat();

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-4 py-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}