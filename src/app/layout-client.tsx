// app/layout-client.tsx
'use client';

import { usePathname } from 'next/navigation';
import SidebarNav from '../../components/SidebarNav';
import CopilotSticky from '../../components/CopilotSticky';
import { ChatProvider } from '../../components/ChatContext';
import { AuthProvider } from './auth-context';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signin', '/auth/login', '/auth/signin'].includes(pathname);

  if (isAuthPage) {
    return <>{children}</>; // ✅ just render auth pages normally
  }

  return (
    <AuthProvider>
      <ChatProvider>
        <ProtectedRoute>
          <div className="flex h-full w-full">
            <SidebarNav />
            <main className="flex-1 overflow-y-auto relative">
              {children}
              <CopilotSticky />
            </main>
          </div>
        </ProtectedRoute>
      </ChatProvider>
    </AuthProvider>
  );
}
