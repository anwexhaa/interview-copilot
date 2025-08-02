// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './layout-client';

export const metadata: Metadata = {
  title: 'Interview Copilot',
  description: 'Your AI-powered interview assistant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans h-screen overflow-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
