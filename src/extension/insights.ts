export type InsightCategory = 'key_factors' | 'risks' | 'opportunities' | 'personal_fit' | 'actions';

export interface InsightPromptResponse {
  id: string; // e.g., 'inv_attraction'
  category: InsightCategory;
  question: string;
  response: string; // User's text input
  tags: string[]; // From suggestion chips
  isPinned: boolean;
  completedAt: number | null; // Timestamp
}

export interface InsightProgress {
  totalPrompts: number;
  completedPrompts: number;
  completionPercent: number;
  status: 'getting_started' | 'in_progress' | 'nearly_complete' | 'complete';
}

export interface DealInsights {
  schemaVersion: number;
  lastUpdated: number;
  progress: InsightProgress;
  prompts: {
    [promptId: string]: InsightPromptResponse;
  };
  freeformNotes: string;
}