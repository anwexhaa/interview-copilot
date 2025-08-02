// app/mock/system-design/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useSystemChat } from './SystemChatContext';

export default function SystemDesignPage() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, loading, setLoading } = useSystemChat();

  const handleSend = async () => {
    if (!input.trim()) return;

    const prompt = input.trim();
    addMessage({ role: 'user', content: prompt });
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/system-chat`
, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('AI response failed');

      const data = await res.json();
      addMessage({ role: 'ai', content: data.response });
    } catch (err) {
      console.error(err);
      addMessage({ role: 'ai', content: '❌ Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col justify-between flex-1 px-6 py-6 bg-background font-sans overflow-y-auto h-screen relative">
      {/* Header */}
      <div className="mb-6 sticky top-0 z-10 bg-background pb-2">
        <div>
          {messages.length === 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-1 font-medium">System Design Practice</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Ready for your mock interview?
              </h1>
            </>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg text-sm max-w-[75%] ${
              msg.role === 'user'
                ? 'self-end bg-primary text-white'
                : 'self-start bg-[#2f2f2f] text-white'

            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="self-start text-white text-sm px-4 py-2 rounded-lg bg-[#2f2f2f] animate-pulse w-fit">
  AI is thinking about system design...
</div>

        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-3 rounded-xl mt-6 sticky bottom-4">
        <input
          className="flex-1 bg-transparent outline-none text-sm font-medium text-white placeholder:text-muted-foreground"
          placeholder="Ask about system architecture, scalability patterns..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90"
          onClick={handleSend}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}