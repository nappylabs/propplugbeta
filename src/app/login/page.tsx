'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/shared/firebase';
import { Logo } from '@/shared/components/Logo';
import { GoogleIcon } from '@/extension/GoogleIcon';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginRedirect = async (user: User) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    let plan = 'free';
    if (userSnap.exists()) {
      plan = userSnap.data()?.plan || 'free';
    }

    const data = searchParams.get('data');
    console.log('[Login Page] Received data param:', data ? data.substring(0, 50) + '...' : 'null');

    const redirectPath = plan === 'core' ? '/dashboard' : '/limited-dashboard';
    const redirectUrl = data ? `${redirectPath}?data=${encodeURIComponent(data)}` : redirectPath;
    
    router.replace(redirectUrl);
  };

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log("User authenticated, redirecting...");
        handleLoginRedirect(user);
      }
    });
    return () => unsubscribe();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // useEffect will handle redirect
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // useEffect will handle redirect
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617]">
      <div className="w-full max-w-sm bg-[#0F172A] rounded-2xl shadow-xl p-8 border border-slate-800">
        <div className="flex flex-col items-center justify-center mb-6 text-white">
           <div className="h-12 flex items-center justify-center"><Logo /></div>
           <span className="text-2xl font-bold mt-2">PropPlug</span>
        </div>
        
        <h2 className="text-xl font-bold text-center text-white mb-1">Welcome back</h2>
        <p className="text-xs text-center text-slate-400 mb-8">Sign in to access your dashboard</p>

        {error && <p className="text-rose-500 text-xs text-center mb-4">{error}</p>}

        <button onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-700 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl transition-all text-sm mb-6">
          <GoogleIcon className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>

        <div className="relative mb-6">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
           <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-600"><span className="bg-[#0F172A] px-2">Or email</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#6366F1]" />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#6366F1]" />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-[#6366F1] transition-colors">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <Link href="/signup" className="text-xs text-slate-400 hover:text-white transition-colors">
                Don't have an account? <span className="text-[#6366F1]">Sign Up</span>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}