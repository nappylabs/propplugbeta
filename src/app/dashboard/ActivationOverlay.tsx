'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { Zap, ChevronRight, Lock } from 'lucide-react';

export const ActivationOverlay = () => {
  const { state, updateStep } = useOnboarding();

  // Only show on step 1 (Intro / Manual Prompt)
  if (state.step !== 1) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-xl w-full bg-[#0F172A] border border-slate-700 rounded-[2.5rem] shadow-2xl p-12 text-center relative overflow-hidden"
      >
        {/* Premium Gradient Top Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />
        
        <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-indigo-500 border border-indigo-500/20">
          <Zap size={40} fill="currentColor" className="animate-pulse" />
        </div>

        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
          Master the Manual.
        </h2>
        <p className="text-slate-400 font-medium text-lg mb-10 leading-relaxed">
          Before we automate everything with the Chrome Extension, let's create a manual property to understand the deep analysis engine.
        </p>

        <div className="space-y-6">
          <button 
            onClick={() => updateStep(2)}
            className="group w-full py-5 bg-white text-[#0F172A] rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20"
          >
            <span>Start Manual Analysis</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <Lock size={12} />
            <span>Secure Connection • 342 Investors joined this week</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};