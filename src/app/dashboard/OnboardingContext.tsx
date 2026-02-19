'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingState {
  step: number;
  persona: 'investor' | 'owner' | 'tenant' | null;
  isExtensionInstalled: boolean;
  hasCreatedFirstDeal: boolean;
  clarityScore: number;
}

interface OnboardingContextType {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  updateStep: (newStep: number) => void;
  setPersona: (persona: OnboardingState['persona']) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<OnboardingState>({
    step: 0, // 0 = Welcome/Overlay, 1 = Extension, 2 = First Deal, 3 = Analysis
    persona: null,
    isExtensionInstalled: false,
    hasCreatedFirstDeal: false,
    clarityScore: 0
  });

  // In a real app, you would sync this with Firestore/LocalStorage here
  const updateStep = (newStep: number) => setState(prev => ({ ...prev, step: newStep }));
  const setPersona = (persona: OnboardingState['persona']) => setState(prev => ({ ...prev, persona }));

  return (
    <OnboardingContext.Provider value={{ state, setState, updateStep, setPersona }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};