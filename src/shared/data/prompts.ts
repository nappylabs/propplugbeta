export const INSIGHTS_CONFIG = {
  investor_rent: {
    snapshot: {
      positives: ['Strong rental demand', 'High yield', 'Growth area', 'Below market price', 'Good tenant profile'],
      negatives: ['High levies', 'Old building', 'Low rental demand', 'Poor condition', 'Complex body corporate'],
      primaryReason: ['Cash flow', 'Capital growth', 'Flip opportunity', 'Lifestyle', 'Affordability', 'Backup option']
    },
    drivers: ['Rental demand strength', 'Yield potential', 'Location fundamentals', 'Tenant quality', 'Price advantage', 'Financing viability'],
    risks: ['Vacancy risk', 'Area decline risk', 'Interest rate exposure', 'Maintenance burden', 'Tenant risk', 'Liquidity risk', 'Regulatory risk'],
    opportunities: ['Renovation potential', 'Re-tenanting upside', 'Area growth', 'Development nearby', 'Rental increase potential', 'Short-term letting option'],
    personalFit: {
      alignment: { label: 'Portfolio Alignment', options: ['Core strategy property', 'Diversification play', 'High-risk/high-return', 'Conservative investment', 'Opportunistic buy'] },
      capitalImpact: { label: 'Capital Impact', options: ['Comfortable purchase', 'Stretch but manageable', 'High exposure', 'Requires selling assets'] },
      managementStyle: { label: 'Management Style', options: ['Hands-off', 'Managed', 'Active involvement'] }
    },
    checklist: [
      { id: 'inv_rent_check_1', label: 'Verify rental comps' },
      { id: 'inv_rent_check_2', label: 'Confirm levies and rates' },
      { id: 'inv_rent_check_3', label: 'Inspect property condition' },
      { id: 'inv_rent_check_4', label: 'Assess tenant demand' },
      { id: 'inv_rent_check_5', label: 'Check financing options' },
      { id: 'inv_rent_check_6', label: 'Calculate net yield' },
      { id: 'inv_rent_check_7', label: 'Review body corporate minutes' },
      { id: 'inv_rent_check_8', label: 'Confirm insurance costs' },
    ],
    observations: {
      viewingNotes: ['Better than photos', 'Worse than photos', 'Noise issues', 'Structural concerns', 'Positive neighborhood feel'],
      marketSignals: ['Underpriced vs market', 'Overpriced', 'Competitive listing', 'Slow market response']
    },
    finalAssessment: {
      decisionLean: ['Strong Buy', 'Buy if conditions met', 'Neutral', 'Lean No', 'Strong No'],
      strategyFit: ['Perfect fit', 'Good fit', 'Partial fit', 'Poor fit'],
      stressLevel: ['Comfortable', 'Slightly anxious', 'Very stretched']
    }
  },
  investor_flip: {
    snapshot: {
      positives: ['Huge discount', 'Cosmetic reno only', 'Hot flip area', 'Strong ARV', 'Quick turnaround potential'],
      negatives: ['Structural issues', 'Bad location', 'Low ARV ceiling', 'Permit complexity', 'Market cooling'],
      primaryReason: ['Cash flow', 'Capital growth', 'Flip opportunity', 'Lifestyle', 'Affordability', 'Backup option']
    },
    drivers: ['Purchase price discount', 'Forced appreciation potential', 'Market velocity', 'Low reno complexity', 'ARV gap'],
    risks: ['Budget overrun', 'Timeline delay', 'Market shift', 'Hidden structural issues', 'Contractor risk'],
    opportunities: ['High-end finishes', 'Layout change', 'Garden cottage potential', 'Subdivision', 'Rezoning'],
    personalFit: {
      alignment: { label: 'Portfolio Alignment', options: ['Core strategy property', 'Diversification play', 'High-risk/high-return', 'Conservative investment', 'Opportunistic buy'] },
      capitalImpact: { label: 'Capital Impact', options: ['Comfortable purchase', 'Stretch but manageable', 'High exposure', 'Requires selling assets'] },
      managementStyle: { label: 'Management Style', options: ['Hands-off', 'Managed', 'Active involvement'] }
    },
    checklist: [
        { id: 'inv_flip_check_1', label: 'Renovation cost estimate' },
        { id: 'inv_flip_check_2', label: 'Get contractor quotes' },
        { id: 'inv_flip_check_3', label: 'ARV validation with agents' },
        { id: 'inv_flip_check_4', label: 'Holding cost estimate' },
        { id: 'inv_flip_check_5', label: 'Market liquidity check' },
        { id: 'inv_flip_check_6', label: 'Check permit requirements' },
        { id: 'inv_flip_check_7', label: 'Structural inspection' },
    ],
    observations: {
      viewingNotes: ['Better than photos', 'Worse than photos', 'Noise issues', 'Structural concerns', 'Positive neighborhood feel'],
      marketSignals: ['Underpriced vs market', 'Overpriced', 'Competitive listing', 'Slow market response']
    },
    finalAssessment: {
      decisionLean: ['Strong Buy', 'Buy if conditions met', 'Neutral', 'Lean No', 'Strong No'],
      strategyFit: ['Perfect fit', 'Good fit', 'Partial fit', 'Poor fit'],
      stressLevel: ['Comfortable', 'Slightly anxious', 'Very stretched']
    }
  },
  owner: {
    snapshot: {
      positives: ['Dream location', 'Perfect size', 'Great value', 'Move-in ready', 'Future potential'],
      negatives: ['Bit small', 'Needs work', 'At top of budget', 'Long commute', 'Area concerns'],
      primaryReason: ['Cash flow', 'Capital growth', 'Flip opportunity', 'Lifestyle', 'Affordability', 'Backup option']
    },
    drivers: ['Location & commute', 'Space & layout', 'Price & affordability', 'Neighborhood feel', 'Long-term fit'],
    risks: ['Overstretching budget', 'Interest rate hikes', 'Unexpected maintenance', 'Neighborhood changes', 'Resale difficulty'],
    opportunities: ['Minor cosmetic upgrades', 'Landscaping', 'Future extension', 'Community involvement'],
    personalFit: {
      lifestyleFit: { label: 'Lifestyle Fit', options: ['Perfect Commute', 'Great for Family', 'Close to Amenities', 'Quiet & Safe', 'Future family plans'] },
      capitalImpact: { label: 'Financial Position', options: ['Comfortable purchase', 'Stretch but manageable', 'High exposure', 'Requires selling assets'] },
    },
    checklist: [
        { id: 'owner_check_1', label: 'Get bond pre-approval' },
        { id: 'owner_check_2', label: 'Test the commute (peak hours)' },
        { id: 'owner_check_3', label: 'Evaluate school options' },
        { id: 'owner_check_4', label: 'Research area safety' },
        { id: 'owner_check_5', label: 'Professional property inspection' },
        { id: 'owner_check_6', label: 'Review monthly cost breakdown' },
    ],
    observations: {
      viewingNotes: ['Better than photos', 'Worse than photos', 'Noise issues', 'Structural concerns', 'Positive neighborhood feel'],
      marketSignals: ['Underpriced vs market', 'Overpriced', 'Competitive listing', 'Slow market response']
    },
    finalAssessment: {
      decisionLean: ['Strong Buy', 'Buy if conditions met', 'Neutral', 'Lean No', 'Strong No'],
      strategyFit: ['Perfect fit', 'Good fit', 'Partial fit', 'Poor fit'],
      stressLevel: ['Comfortable', 'Slightly anxious', 'Very stretched']
    }
  },
  tenant: {
    snapshot: {
      positives: ['Good value', 'Great location', 'Spacious', 'Modern finishes', 'Pet friendly'],
      negatives: ['A bit pricey', 'Noisy area', 'Old apartment', 'Strict rules', 'Far from work'],
      primaryReason: ['Lifestyle', 'Affordability', 'Backup option']
    },
    drivers: ['Budget fit', 'Location convenience', 'Lease flexibility', 'Amenities', 'Safety perception'],
    risks: ['High annual escalation', 'Unresponsive landlord', 'Hidden utility costs', 'Losing deposit', 'Safety concerns'],
    opportunities: ['Negotiate rent', 'Long-term lease discount', 'Clarify utility costs', 'Request improvements'],
    personalFit: {
      dailyLivingFit: { label: 'Daily Living Fit', options: ['Budget comfort', 'Location convenience', 'Lease flexibility', 'Amenities', 'Safety perception'] },
    },
    checklist: [
        { id: 'tenant_check_1', label: 'Review lease terms carefully' },
        { id: 'tenant_check_2', label: 'Confirm deposit amount & terms' },
        { id: 'tenant_check_3', label: 'Clarify all utility costs' },
        { id: 'tenant_check_4', label: 'Check parking availability' },
        { id: 'tenant_check_5', label: 'Assess area safety (night/day)' },
        { id: 'tenant_check_6', label: 'Test the commute' },
    ],
    observations: {
      viewingNotes: ['Better than photos', 'Worse than photos', 'Noise issues', 'Structural concerns', 'Positive neighborhood feel'],
      marketSignals: ['Priced well for area', 'Slightly overpriced', 'Many similar units available']
    },
    finalAssessment: {
      decisionLean: ['Sign the lease', 'Negotiate first', 'Keep looking', 'Strong pass'],
      strategyFit: ['Perfect fit', 'Good fit', 'Compromise', 'Poor fit'],
      stressLevel: ['Comfortable', 'Slightly anxious', 'Very stretched']
    }
  }
};

export const INSIGHTS_WEIGHTS = {
  snapshot: 10,
  drivers: 10,
  risks: 10,
  opportunities: 10,
  personalFit: 20,
  checklist: 25,
  finalAssessment: 15,
}
