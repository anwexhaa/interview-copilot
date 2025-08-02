'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SettingsView() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1a1a] p-8 shadow-xl border border-white/10 text-foreground">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {/* Example setting item - you can add more like this */}
          <div className="space-y-1">
            <h3 className="font-medium">Account</h3>
            <p className="text-sm text-muted-foreground">
              Update your account information
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-4"></div>

          {/* Logout button with better visual hierarchy */}
          <div className="pt-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full rounded-xl py-2 h-12 text-md font-medium hover:shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] transition-all"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}