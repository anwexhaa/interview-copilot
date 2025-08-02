// app/mock/system-design/layout.tsx
'use client';

import { SystemChatProvider } from './SystemChatContext';
import type { ReactNode } from 'react';

export default function SystemDesignLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SystemChatProvider>
      {children}
    </SystemChatProvider>
  );
}