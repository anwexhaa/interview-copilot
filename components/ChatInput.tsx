'use client';

import { useState } from 'react';
import { useChat } from './ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setLoading } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;

    // Show user message immediately
    addMessage({ role: 'user', content: prompt });
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('AI response failed');

      const data = await res.json();
      addMessage({ role: 'ai', content: data.aiMessage });
    } catch (err) {
      console.error(err);
      addMessage({ role: 'ai', content: '❌ Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 p-2 border-t border-gray-300">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded-md">
        Send
      </button>
    </form>
  );
}
