'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { auth } from '@/shared/firebase';
import { Logo } from '@/shared/components/Logo';
import Link from 'next/link';
import { Check, ShieldCheck, Zap, CreditCard, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-4 text-lg font-bold">
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
        {icon}
      </div>
      {text}
    </li>
  );
}

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'core'>('core');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirect = () => {
    const data = searchParams.get('data');
    // Redirect to dashboard with onboarding flag
    const redirectUrl = data ? `/dashboard?data=${data}&onboarding=true` : '/dashboard?onboarding=true';
    router.replace(redirectUrl);
  };

  const createUserDocument = async (user: User, plan: 'free' | 'core') => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    
    const userData: any = {
      email: user.email,
      displayName: name,
      createdAt: serverTimestamp(),
      uid: user.uid,
      plan: plan,
      onboardingStatus: 'needs_extension'
    };

    if (plan === 'core') {
        // Calculate trial end date (5 days from now)
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 5);
        userData.trialActive = true;
        userData.trialEndsAt = trialEndDate;
    }

    await setDoc(userRef, userData, { merge: true });
  };

  const handleSignup = async (plan: 'free' | 'core') => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user, plan);
      handleRedirect();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email || !password) {
          setError("Please fill in all fields.");
          return;
      }
      setError(null);
      setStep(2);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* 🟢 LEFT STAGE: Trust & Value */}
      <div className="md:w-1/2 bg-[#0F172A] p-12 md:p-24 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
                <Logo variant="light" />
                <span className="text-2xl font-bold">PropPlug</span>
            </div>

            <div className="space-y-12">
            <h1 className="text-5xl font-black tracking-tighter leading-tight">
                Join the top 1% of <br/> 
                <span className="text-indigo-400">Property Hunters.</span>
            </h1>
            
            <ul className="space-y-6">
                <FeatureItem icon={<Zap className="text-indigo-400" />} text="Full access to the Chrome Extension" />
                <FeatureItem icon={<ShieldCheck className="text-indigo-400" />} text="Unlimited 10-year wealth projections" />
                <FeatureItem icon={<CreditCard className="text-indigo-400" />} text="5-Day Free Trial (Cancel anytime)" />
            </ul>

            <div className="p-8 bg-slate-800/50 rounded-[2.5rem] border border-slate-700">
                <p className="italic text-slate-300 font-medium mb-4">
                "PropPlug turned our 4-hour weekend spreadsheet grind into a 10-minute coffee break. We caught a red flag on a 'deal' that saved us R200k."
                </p>
                <p className="font-black text-sm uppercase tracking-widest text-indigo-400">— David M., Property Investor</p>
            </div>
            </div>
        </div>
        
        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-12 relative z-10">
          Trusted by 500+ South African Investors
        </div>
      </div>

      {/* 🔵 RIGHT STAGE: High-Efficiency Form */}
      <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center bg-[#F8FAFC]">
        <div className="max-w-md w-full mx-auto space-y-10">
          
          {/* Progress Indicator */}
          <div className="flex gap-2">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {step === 1 ? "Create your account" : step === 2 ? "Choose your plan" : "Secure your trial"}
            </h2>
            <p className="text-slate-500 font-medium">
              {step === 1 ? "Get started with your 5-day professional trial." : step === 2 ? "Select the plan that fits your goals." : "No charge today. You can cancel with one click."}
            </p>
          </div>

          {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                  <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="w-full p-5 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-5 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-900" />
                </div>
                <button onClick={handleContinue} className="w-full py-5 bg-[#0F172A] text-white rounded-2xl font-black text-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                  Continue <ArrowRight size={20} />
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 {/* Toggle */}
                 <div className="flex justify-center mb-2">
                    <div className="bg-slate-100 p-1 rounded-full flex items-center relative">
                        <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Monthly</button>
                        <button onClick={() => setBillingCycle('annual')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'annual' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Annual <span className="text-[10px] text-emerald-600 ml-1">-40%</span></button>
                    </div>
                 </div>

                 <div className="grid gap-4">
                    {/* Free Plan */}
                    <div className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'free' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => setSelectedPlan('free')}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-black text-lg text-slate-900">Free</h3>
                            <span className="font-black text-2xl text-slate-900">R0</span>
                        </div>
                        <ul className="space-y-2 mb-4">
                            <li className="flex gap-2 text-xs text-slate-600"><Check size={14} className="text-indigo-600"/> Chrome Extension</li>
                            <li className="flex gap-2 text-xs text-slate-600"><Check size={14} className="text-indigo-600"/> Expense Tracker</li>
                            <li className="flex gap-2 text-xs text-slate-600"><Check size={14} className="text-indigo-600"/> Limited Analysis</li>
                        </ul>
                        {selectedPlan === 'free' && <button onClick={() => handleSignup('free')} disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">{loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Join for Free'}</button>}
                    </div>

                    {/* Core Plan */}
                    <div className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${selectedPlan === 'core' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => setSelectedPlan('core')}>
                        {billingCycle === 'monthly' && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">60% OFF 1st Mo</div>}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-black text-lg text-indigo-600">Core</h3>
                            <div className="text-right">
                                <span className="font-black text-2xl text-slate-900 block">{billingCycle === 'annual' ? 'R1080' : 'R60'}</span>
                                {billingCycle === 'annual' ? (
                                    <span className="text-[10px] text-slate-500 font-medium">per year (R90/mo)</span>
                                ) : (
                                    <span className="text-[10px] text-slate-500 font-medium">1st mo, then R150/mo</span>
                                )}
                            </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                            <li className="flex gap-2 text-xs text-slate-600"><Check size={14} className="text-indigo-600"/> Unlimited Deal Saving</li>
                            <li className="flex gap-2 text-xs text-slate-600"><Check size={14} className="text-indigo-600"/> Comparison Module</li>
                            <li className="flex gap-2 text-xs text-slate-600"><Check size={14} className="text-indigo-600"/> 10-Year Projections</li>
                        </ul>
                        {selectedPlan === 'core' && <button onClick={() => setStep(3)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">Start 5-Day Trial</button>}
                    </div>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-6 bg-white rounded-[2rem] shadow-sm space-y-4 border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-50 pb-4">
                    <CreditCard size={20} className="text-indigo-600" />
                    Secure Payment Details
                  </div>
                  <input type="text" placeholder="Card Number" className="w-full p-4 rounded-xl bg-slate-50 border-none font-medium text-slate-900" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" className="w-1/2 p-4 rounded-xl bg-slate-50 border-none font-medium text-slate-900" />
                    <input type="text" placeholder="CVC" className="w-1/2 p-4 rounded-xl bg-slate-50 border-none font-medium text-slate-900" />
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl text-xs text-indigo-700 font-bold leading-relaxed">
                  <Lock size={14} className="mt-0.5 shrink-0" />
                  You will not be charged today. Your 5-day trial ends automatically. Cancel anytime from your settings.
                </div>
                <button onClick={() => handleSignup('core')} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 disabled:opacity-70">
                  {loading ? <Loader2 className="animate-spin" /> : 'Start Free Trial'}
                </button>
                <button type="button" onClick={() => setStep(2)} className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                  Go Back
                </button>
              </motion.div>
            )}
            </AnimatePresence>
          </form>

          <p className="text-center text-sm font-medium text-slate-400">
            Already have an account? <Link href="/login" className="text-indigo-600 font-black">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div></div>}>
      <SignupContent />
    </Suspense>
  );
}