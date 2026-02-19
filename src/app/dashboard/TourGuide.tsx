'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { MousePointerClick, Navigation, BarChart2, Layers, Edit3, Brain, CheckCircle, Zap } from 'lucide-react';

export const TourGuide = () => {
  const { state, updateStep } = useOnboarding();
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);

  // Define tour steps configuration
  const tourSteps: { [key: number]: { id: string, title: string, content: string | ((persona: string) => string), icon: React.ReactNode, position?: 'top' | 'bottom' } } = {
    2: { 
        id: 'new-analysis-button', 
        title: 'Create Property', 
        content: 'Click here to create your first property analysis manually.',
        icon: <MousePointerClick size={24} className="text-indigo-500" />,
        position: 'bottom'
    },
    3: { 
        id: 'assumptions-grid', 
        title: 'Input Data', 
        content: 'Enter the purchase price, rental income, and expenses here. The dashboard will calculate the rest.',
        icon: <Edit3 size={24} className="text-indigo-500" />
    },
    4: { 
        id: 'kpi-grid', 
        title: 'Key Metrics', 
        content: (persona) => {
            if (persona === 'owner') return 'Monitor your Safety Buffer, Monthly Costs, and Affordability ratios at a glance.';
            if (persona === 'tenant') return 'Compare Rent vs. Buy metrics and track your Savings Rate.';
            return 'Track Yield, Cashflow, and ROI. These cards give you the instant health check of the deal.';
        },
        icon: <BarChart2 size={24} className="text-indigo-500" />,
        position: 'bottom'
    },
    5: { 
        id: 'assumptions-grid', 
        title: 'Detailed Breakdown', 
        content: 'Drill down into the details. Expand these sections to see and adjust the breakdown of costs and income.',
        icon: <Layers size={24} className="text-indigo-500" />
    },
    6: { 
        id: 'edit-assumptions-btn', 
        title: 'Edit Assumptions', 
        content: 'Want to stress-test the deal? Click here to update inflation rates, loan terms, and other key variables.',
        icon: <Edit3 size={24} className="text-indigo-500" />,
        position: 'bottom'
    },
    7: { 
        id: 'deal-insights-btn', 
        title: 'Capture Insights', 
        content: 'Don\'t just look at numbers. Click here to open the Insights Engine and record your qualitative analysis.',
        icon: <Brain size={24} className="text-indigo-500" />,
        position: 'bottom'
    }
  };

  const currentStep = tourSteps[state.step];

  React.useEffect(() => {
    if (currentStep) {
      const element = document.getElementById(currentStep.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetRect(null);
    }
  }, [state.step, currentStep]);

  if (!targetRect || !currentStep) return null;

  const contentText = typeof currentStep.content === 'function' ? currentStep.content(state.persona || 'investor') : currentStep.content;

  return (
    <AnimatePresence>
      {/* Spotlight Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[990] bg-slate-900/50 backdrop-blur-[2px] transition-all duration-500"
        style={{
            clipPath: `polygon(
                0% 0%, 
                0% 100%, 
                100% 100%, 
                100% 0%, 
                ${targetRect.left}px 0%, 
                ${targetRect.left}px ${targetRect.top}px, 
                ${targetRect.right}px ${targetRect.top}px, 
                ${targetRect.right}px ${targetRect.bottom}px, 
                ${targetRect.left}px ${targetRect.bottom}px, 
                ${targetRect.left}px 0%
            )`
        }}
      />

      {/* Highlight Border */}
      <div
        className="fixed border-2 border-indigo-500 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.5)] z-[991] pointer-events-none transition-all duration-300 ease-in-out"
        style={{
          left: targetRect.left - 4,
          top: targetRect.top - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      {/* Tooltip Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={state.step}
        style={{
          position: 'fixed',
          top: currentStep.position === 'bottom' ? targetRect.bottom + 20 : Math.max(20, targetRect.top - 240),
          left: Math.max(20, Math.min(window.innerWidth - 340, targetRect.left + (targetRect.width / 2) - 160)),
        }}
        className="bg-white text-[#0F172A] p-6 rounded-2xl shadow-2xl max-w-xs w-full z-[999]"
      >
        <div className="mb-3">{currentStep.icon}</div>
        <h3 className="font-black text-lg mb-2">{currentStep.title}</h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{contentText}</p>
        
        {state.step > 2 && (
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Step {state.step - 2} of 5</span>
                <button 
                    onClick={() => updateStep(state.step + 1)}
                    className="px-4 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                    {state.step === 7 ? 'Finish Tour' : 'Next'} <CheckCircle size={12} />
                </button>
            </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};