'use client';

import { useState } from 'react';
import { useChat } from './ChatContext';
import { getAuth } from 'firebase/auth';  // <-- import getAuth from firebase

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setLoading } = useChat();
  const auth = getAuth();  // <-- initialize Firebase Auth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;
    console.log('Fetching from URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/ask`);

    addMessage({ role: 'user', content: prompt });
    setInput('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const idToken = await user.getIdToken(); // get Firebase ID token

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,  // <-- send token in header
        },
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
