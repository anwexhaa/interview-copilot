// app/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  getRedirectResult,
  signInWithRedirect,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
}>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Detect if on mobile
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    // 1️⃣ First check if we're returning from a redirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);

          const token = await result.user.getIdToken();

          // Wait 500ms before calling backend fetch to stabilize mobile redirect flow
          await new Promise((r) => setTimeout(r, 500));

          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
          } catch (err) {
            console.error('Login fetch error:', err);
          }
        }
      })
      .catch((err) => {
        console.error('Redirect login failed:', err);
      });

    // 2️⃣ Listen for auth state changes
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      try {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          const token = await result.user.getIdToken();
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
          } catch (err) {
            console.error('Login fetch error:', err);
          }
        }
      } catch (err) {
        console.error('Popup login failed:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
