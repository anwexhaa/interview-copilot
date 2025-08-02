'use client';

import { useState } from 'react';
import { useSystemChat } from './SystemChatContext';

export default function SystemChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setLoading } = useSystemChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;

    addMessage({ role: 'user', content: prompt });
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/ask`
, {
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
  <form onSubmit={handleSubmit} className="flex w-full gap-3">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask a system design question..."
      className="flex-grow rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button
      type="submit"
      disabled={!input.trim()}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Send
    </button>
  </form>
);
}
