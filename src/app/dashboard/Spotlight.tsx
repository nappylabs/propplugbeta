'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { MousePointerClick } from 'lucide-react';

export const Spotlight = () => {
  const { state } = useOnboarding();
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);

  const targetId = 'new-analysis-button';

  React.useEffect(() => {
    if (state.step === 2) {
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetRect(null);
    }
  }, [state.step]);

  if (!targetRect) return null;

  return (
    <>
      {/* The spotlight overlay. The box-shadow creates the dark overlay,
          and the element itself is positioned over the target, but with
          pointer-events: none, so clicks go through to the button below. */}
      <div
        className="fixed"
        style={{
          left: targetRect.left,
          top: targetRect.top,
          width: targetRect.width,
          height: targetRect.height,
          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.8)',
          borderRadius: '0.75rem', // same as the button
          pointerEvents: 'none',
        }}
      />
      
      {/* The animated border to draw more attention */}
      <div
        className="fixed border-2 border-dashed border-indigo-500 animate-pulse"
        style={{
          left: targetRect.left - 4,
          top: targetRect.top - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          borderRadius: '1rem',
          pointerEvents: 'none',
        }}
      />

      {/* The tooltip card. This has a high z-index and default pointer-events, so it's interactive. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed',
          top: targetRect.bottom + 24,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        }}
        className="bg-white text-[#0F172A] p-6 rounded-2xl shadow-2xl max-w-xs w-full z-[999]"
      >
        <MousePointerClick size={24} className="text-indigo-500 mb-3" />
        <h3 className="font-black text-lg mb-2">Create Your First Analysis</h3>
        <p className="text-sm text-slate-600">
          This is where the magic happens. Click here to start your first property analysis.
        </p>
      </motion.div>
    </>
  );
};