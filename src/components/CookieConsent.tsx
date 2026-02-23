'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

interface CookieConsentProps {
  manualOpen?: boolean;
  onClose?: () => void;
}

export const CookieConsent = ({ manualOpen, onClose }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('propplug_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (manualOpen) {
      setIsVisible(true);
    }
  }, [manualOpen]);

  const close = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleAccept = () => {
    localStorage.setItem('propplug_cookie_consent', 'true');
    close();
  };

  const handleDecline = () => {
    localStorage.setItem('propplug_cookie_consent', 'false');
    close();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-4 z-[100] shadow-2xl animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 shrink-0">
            <Cookie size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">We use cookies</h4>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              We use cookies and similar technologies to provide our service, analyze usage, and personalize your experience. 
              By using PropPlug, you agree to our <Link href="/cookies" target="_blank" className="text-orange-400 hover:underline">Cookie Policy</Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors border border-zinc-700 whitespace-nowrap"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            Accept All
          </button>
          <button 
            onClick={close}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};