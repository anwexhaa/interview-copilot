'use client';

import { useState, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignUp = async () => {
  setError('');
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔑 Get the Firebase ID Token
    const idToken = await user.getIdToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`, // 👈 Include token here
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
      }),
    });

    if (!response.ok) {
      throw new Error('User created in Firebase but failed to save to DB.');
    }

    router.push('/');
  } catch (err: any) {
    setError(err.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-lime-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our community today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
              ref={emailRef}
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
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full bg-white/70 text-gray-800 border-gray-300/50 focus:ring-2 focus:ring-purple-300"
            />
            </div>

            <Button
              onClick={handleSignUp}
              className="w-full mt-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-200/50 transition-all duration-300"
            >
              Sign Up
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}