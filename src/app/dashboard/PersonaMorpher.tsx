'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { TrendingUp, Home, Key } from 'lucide-react';

export const PersonaMorpher = () => {
  const { state, setPersona, updateStep } = useOnboarding();

  if (state.step !== 0) return null;

  const personas = [
    { id: 'investor', label: 'Investor', icon: <TrendingUp size={32} />, desc: 'Analyze yields, flips, and cashflow.' },
    { id: 'owner', label: 'Homeowner', icon: <Home size={32} />, desc: 'Check affordability and long-term value.' },
    { id: 'tenant', label: 'Tenant', icon: <Key size={32} />, desc: 'Compare rent vs. buy scenarios.' },
  ];

  const handleSelect = (id: any) => {
    setPersona(id);
    updateStep(1);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-5xl w-full px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Who are you?</h2>
          <p className="text-slate-400 text-lg">We'll tailor the dashboard to your goals.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelect(p.id)}
              className="group relative bg-[#0F172A] border border-slate-700 hover:border-indigo-500 p-8 rounded-[2.5rem] text-left transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                {p.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{p.label}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{p.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};