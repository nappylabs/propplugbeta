'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Analyzer from '../Analyzer';
import { auth } from '@/shared/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Logo } from '@/shared/components/Logo';
import { LogOut, Lock } from 'lucide-react';

function LimitedDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        // Security Check: If a Core user lands here, redirect them to the full dashboard.
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().plan === 'core') {
          router.replace('/dashboard');
          return;
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    console.log('[Limited Dashboard] Received data param:', dataParam ? dataParam.substring(0, 50) + '...' : 'null');
    if (dataParam) {
      try {
        // Unicode-safe decoding
        console.log('[Limited Dashboard] Attempting to decode...');
        const decoded = decodeURIComponent(escape(atob(dataParam)));
        console.log('[Limited Dashboard] Decode successful. Parsing JSON...');
        setInitialData(JSON.parse(decoded));
      } catch (e) {
        console.error("--- CRASH REPORT ---");
        console.error("[Limited Dashboard] Handoff failed. The error occurred during decoding or parsing:", e);
        console.error("--- END CRASH REPORT ---");
      }
    }
  }, [searchParams]);

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { plan: 'core' }, { merge: true });
      
      // Redirect to full dashboard with data
      const dataParam = searchParams.get('data');
      const url = dataParam ? `/dashboard?data=${dataParam}` : '/dashboard';
      router.push(url);
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Upgrade failed. Please try again.");
      setUpgrading(false);
    }
  };

  if (loading) {
     return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Lock size={16} className="text-white" />
                </div>
                <p className="text-sm font-medium text-white">
                    You're on the <span className="font-bold">Free Plan</span>. Upgrade to Core to unlock editing, saving, and advanced insights.
                </p>
            </div>
            <button 
                onClick={handleUpgrade}
                disabled={upgrading}
                className="px-5 py-1.5 bg-white text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-70"
            >
                {upgrading ? 'Upgrading...' : 'Upgrade to Core'}
            </button>
        </div>

        <nav className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
                <span className="text-white font-bold text-lg hidden sm:block">PropPlug</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded ml-2">Free View</span>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <button onClick={() => auth.signOut()} className="text-slate-500 hover:text-rose-500 transition-colors">
                        <LogOut size={18} />
                    </button>
                )}
            </div>
        </nav>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto opacity-90">
            <Analyzer initialData={initialData} user={user} mode="limited" />
        </main>
    </div>
  );
}

export default function LimitedDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div></div>}>
      <LimitedDashboardContent />
    </Suspense>
  );
}