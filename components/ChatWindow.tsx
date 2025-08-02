'use client';

import { useChat } from './ChatContext';
import ReactMarkdown from 'react-markdown';

export default function ChatWindow() {
  const { messages } = useChat();

  return (
    <div className="p-4 flex flex-col gap-3 overflow-y-auto h-[calc(100vh-150px)] bg-[#0c0c0d] text-[#f4f4f5]">
      {messages.map((msg, i) => (
  <div
    key={i}
    className={`max-w-[75%] px-4 py-2 rounded-xl shadow-md ${
      msg.role === 'user'
        ? 'bg-blue-600 text-white self-end'
        : 'bg-[#171717] text-white self-start border border-white/10'
    }`}
  >
    <div className="prose prose-invert text-sm max-w-none">
      <ReactMarkdown>{msg.content}</ReactMarkdown>
    </div>
  </div>
))}
    </div>
  );
}
