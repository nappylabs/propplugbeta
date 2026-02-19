export interface Prompt {
  id: string;
  category: 'key_factors' | 'risks' | 'opportunities' | 'personal_fit' | 'actions';
  question: string;
  chips: string[];
  isChecklist?: boolean;
}

export const PROMPTS: { [key: string]: Prompt[] } = {
  investor: [
    {
      id: 'inv_attraction',
      category: 'key_factors',
      question: 'What makes this financially attractive?',
      chips: ['High Yield', 'Below Market Value', 'Strong Rental Demand', 'Growth Area'],
    },
    {
      id: 'inv_strategy',
      category: 'key_factors',
      question: 'What is the primary investment strategy?',
      chips: ['Buy-to-Let', 'Flip', 'Long-term Hold', 'Portfolio Diversification'],
    },
    {
      id: 'inv_risks',
      category: 'risks',
      question: 'What are the biggest risks in this deal?',
      chips: ['Vacancy Risk', 'Interest Rate Sensitivity', 'High Levies', 'Body Corporate Issues'],
    },
    {
      id: 'inv_opportunities',
      category: 'opportunities',
      question: 'What could significantly improve returns?',
      chips: ['Renovation', 'Re-tenanting', 'Area Growth', 'Undervalued Purchase'],
    },
    {
      id: 'inv_capital',
      category: 'personal_fit',
      question: 'Is this the best use of your capital right now?',
      chips: ['Yes, fits my goals', 'No, other priorities', 'Need more data'],
    },
    {
      id: 'inv_actions',
      category: 'actions',
      question: 'What do you still need to verify before investing?',
      chips: ['Rental Comps', 'Levies & Rates', 'Maintenance Issues', 'Financing Approval', 'Market Trends'],
      isChecklist: true,
    },
  ],
  owner: [
    {
      id: 'own_attraction',
      category: 'key_factors',
      question: 'What attracts you most to living here?',
      chips: ['Location', 'The Space', 'The Price', 'The Garden', 'The Finishes'],
    },
    {
      id: 'own_lifestyle',
      category: 'personal_fit',
      question: 'How well does this fit your lifestyle needs?',
      chips: ['Perfect Commute', 'Great for Family', 'Close to Amenities', 'Quiet & Safe'],
    },
    {
      id: 'own_affordability',
      category: 'risks',
      question: 'What concerns you about affordability or costs?',
      chips: ['Stretches Budget', 'Interest Rate Hikes', 'Unexpected Levies', 'Maintenance Costs'],
    },
    {
      id: 'own_longevity',
      category: 'personal_fit',
      question: 'Can you see yourself living here for several years?',
      chips: ['Yes, 5+ years', 'Maybe, 2-3 years', 'No, short-term only'],
    },
    {
      id: 'own_actions',
      category: 'actions',
      question: 'What do you still need to confirm before buying?',
      chips: ['Commute Test', 'School Options', 'Safety Research', 'Property Inspection', 'Bond Pre-approval'],
      isChecklist: true,
    },
  ],
  tenant: [
    {
      id: 'ten_benefits',
      category: 'key_factors',
      question: 'Which benefits stand out most?',
      chips: ['Good Value', 'Great Location', 'Spacious', 'Modern Finishes', 'Pet Friendly'],
    },
    {
      id: 'ten_lifestyle',
      category: 'personal_fit',
      question: 'How would living here improve your daily life?',
      chips: ['Shorter Commute', 'Better Amenities', 'More Space', 'Safer Area'],
    },
    {
      id: 'ten_risks',
      category: 'risks',
      question: 'What concerns you about the cost or terms?',
      chips: ['Rent is high', 'Annual Escalation', 'Unclear Lease Terms', 'Deposit Amount'],
    },
    {
      id: 'ten_actions',
      category: 'actions',
      question: 'What do you need to confirm before signing?',
      chips: ['Lease Terms', 'Utilities Included', 'Parking', 'Safety', 'Cell Reception'],
      isChecklist: true,
    },
  ],
};