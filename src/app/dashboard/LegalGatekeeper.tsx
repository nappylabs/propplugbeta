'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, FileText, AlertTriangle, Database, Check, ExternalLink, Lock, Scale } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';

export const LegalGatekeeper = ({ onAccept }: { onAccept: () => void }) => {
  const [viewedTerms, setViewedTerms] = useState(false);
  const [viewedPrivacy, setViewedPrivacy] = useState(false);
  
  const [checks, setChecks] = useState({
    terms: false,
    privacy: false,
    investment: false,
    accuracy: false,
    usage: false
  });

  const allChecked = Object.values(checks).every(Boolean);

  const handleLinkClick = (type: 'terms' | 'privacy') => {
    if (type === 'terms') setViewedTerms(true);
    if (type === 'privacy') setViewedPrivacy(true);
  };

  const toggleCheck = (key: keyof typeof checks) => {
    // Prevent checking if the link hasn't been viewed (for terms/privacy)
    if (key === 'terms' && !viewedTerms) return;
    if (key === 'privacy' && !viewedPrivacy) return;
    
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 text-white font-sans">
      <div className="max-w-2xl w-full bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo /></div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Welcome to PropPlug</h1>
          <p className="text-slate-400">Before we start, please review and accept our operating standards.</p>
        </div>

        <div className="space-y-6">
          
          {/* 1. Terms of Service */}
          <div className={`p-4 rounded-xl border transition-all ${checks.terms ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-700'}`}>
            <div className="flex items-start gap-4">
              <div onClick={() => toggleCheck('terms')} className={`mt-1 w-6 h-6 rounded border flex items-center justify-center cursor-pointer transition-colors ${checks.terms ? 'bg-indigo-600 border-indigo-600' : viewedTerms ? 'border-slate-500 hover:border-white' : 'border-slate-700 opacity-50 cursor-not-allowed'}`}>
                {checks.terms && <Check size={14} />}
                {!viewedTerms && !checks.terms && <Lock size={12} className="text-slate-500" />}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">Terms of Service</h3>
                <p className="text-xs text-slate-400 mb-2">You must read our Terms of Service before accepting.</p>
                <Link href="/terms" target="_blank" onClick={() => handleLinkClick('terms')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <FileText size={12} /> Read Terms of Service <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Privacy Policy */}
          <div className={`p-4 rounded-xl border transition-all ${checks.privacy ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-700'}`}>
            <div className="flex items-start gap-4">
              <div onClick={() => toggleCheck('privacy')} className={`mt-1 w-6 h-6 rounded border flex items-center justify-center cursor-pointer transition-colors ${checks.privacy ? 'bg-indigo-600 border-indigo-600' : viewedPrivacy ? 'border-slate-500 hover:border-white' : 'border-slate-700 opacity-50 cursor-not-allowed'}`}>
                {checks.privacy && <Check size={14} />}
                {!viewedPrivacy && !checks.privacy && <Lock size={12} className="text-slate-500" />}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">Privacy Policy</h3>
                <p className="text-xs text-slate-400 mb-2">You must read our Privacy Policy before accepting.</p>
                <Link href="/privacy" target="_blank" onClick={() => handleLinkClick('privacy')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <Shield size={12} /> Read Privacy Policy <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Investment Disclaimer */}
          <div onClick={() => toggleCheck('investment')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.investment ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
            <div className="flex items-start gap-4">
              <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors ${checks.investment ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500'}`}>
                {checks.investment && <Check size={14} />}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 flex items-center gap-2">Investment Policy <AlertTriangle size={14} className="text-amber-500" /></h3>
                <p className="text-xs text-slate-400">
                  I understand PropPlug provides data, not financial advice. I am responsible for my own investment decisions and due diligence.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Data Accuracy */}
          <div onClick={() => toggleCheck('accuracy')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.accuracy ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
            <div className="flex items-start gap-4">
              <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors ${checks.accuracy ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500'}`}>
                {checks.accuracy && <Check size={14} />}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 flex items-center gap-2">Data Accuracy <Scale size={14} className="text-slate-400" /></h3>
                <p className="text-xs text-slate-400">
                  I acknowledge that data is sourced from public listings and may contain errors. I will verify all figures independently.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Listing Data Use */}
          <div onClick={() => toggleCheck('usage')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.usage ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
            <div className="flex items-start gap-4">
              <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors ${checks.usage ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500'}`}>
                {checks.usage && <Check size={14} />}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 flex items-center gap-2">Listing Data Use <Database size={14} className="text-slate-400" /></h3>
                <p className="text-xs text-slate-400">
                  I agree to use this data for personal analysis only and will not scrape, resell, or redistribute it.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onAccept} 
            disabled={!allChecked}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${allChecked ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};