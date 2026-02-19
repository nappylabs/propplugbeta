'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { Brain, Sparkles, CheckCircle } from 'lucide-react';
// Note: You would install canvas-confetti: npm install canvas-confetti @types/canvas-confetti
import confetti from 'canvas-confetti';

export const ClaritySidebar = () => {
  const { state, setState, updateStep } = useOnboarding();

  const calculateClarity = (text: string) => {
    // Simple heuristic: 50 chars = 100% clarity for the "Aha" moment
    const score = Math.min(Math.floor((text.length / 50) * 100), 100);
    setState(prev => ({ ...prev, clarityScore: score }));
  };

  useEffect(() => {
    if (state.clarityScore === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#8B5CF6', '#ffffff']
      });
    }
  }, [state.clarityScore]);

  return (
    <motion.aside 
      initial={{ x: 50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="w-full lg:w-96 bg-white border-l border-slate-200 p-8 flex flex-col gap-8 h-full rounded-l-[2.5rem] shadow-xl"
    >
      {/* Clarity Meter */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Brain size={14} /> Decision Clarity
          </span>
          <span className={`text-2xl font-black transition-colors ${state.clarityScore === 100 ? 'text-emerald-500' : 'text-indigo-600'}`}>
            {state.clarityScore}%
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${state.clarityScore}%` }}
            transition={{ type: "spring", stiffness: 50 }}
            className={`h-full ${state.clarityScore === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
          />
        </div>
        {state.clarityScore === 100 && (
            <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-4">
                <p className="text-xs text-emerald-600 font-bold text-center">
                    🎉 Clarity Achieved! Deal ready to share.
                </p>
                <button 
                    onClick={() => updateStep(4)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle size={16} /> Finish Tour
                </button>
            </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Capture Your <br/><span className="text-indigo-600">"Aha" Moment</span>
        </h3>
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase">Why this property?</label>
          <textarea 
            onChange={(e) => calculateClarity(e.target.value)}
            placeholder="e.g. The rental yield covers the bond, and the area is gentrifying..."
            className="w-full h-40 p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl focus:ring-0 focus:bg-white focus:shadow-lg transition-all font-medium text-slate-700 resize-none placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Endowment Hook */}
      <div className="mt-auto p-6 bg-indigo-50 rounded-3xl border border-indigo-100 relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-indigo-200" size={40} />
        <p className="text-xs text-indigo-900 font-bold leading-relaxed italic relative z-10">
          "Insights stored here power your future AI recommendations. Don't lose this thought."
        </p>
      </div>
    </motion.aside>
  );
};