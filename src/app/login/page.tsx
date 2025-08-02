'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-lime-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full bg-white/70 text-gray-800 border-gray-300/50 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-white/70 text-gray-800 border-gray-300/50 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-200/50 transition-all duration-300"
            >
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a 
              href="/signin" 
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
