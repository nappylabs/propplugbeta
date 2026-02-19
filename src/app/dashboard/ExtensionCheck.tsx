import React from 'react';
import { Chrome, CheckCircle, ExternalLink } from 'lucide-react';

interface ExtensionCheckProps {
  onComplete: () => void;
}

export const ExtensionCheck: React.FC<ExtensionCheckProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020617]/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 mb-6">
          <Chrome size={40} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-white">Install Chrome Extension</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            To build your deal database with live listings, you need our Chrome Extension. It's the bridge between property sites and your dashboard.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <a 
            href="https://chrome.google.com/webstore" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group border border-slate-700 hover:border-slate-600"
          >
            <Chrome size={18} />
            Go to Chrome Store
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>

          <button 
            onClick={onComplete}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            I've Installed It <CheckCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};