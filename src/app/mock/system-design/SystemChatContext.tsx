'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SystemChatContext = createContext<ChatContextType | undefined>(undefined);

export const SystemChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearMessages = () => setMessages([]);

  return (
    <SystemChatContext.Provider value={{ messages, addMessage, clearMessages, loading, setLoading }}>
      {children}
    </SystemChatContext.Provider>
  );
};

export const useSystemChat = () => {
  const context = useContext(SystemChatContext);
  if (!context) throw new Error('useSystemChat must be used inside SystemChatProvider');
  return context;
};
