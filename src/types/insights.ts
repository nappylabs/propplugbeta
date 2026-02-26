export type ProfileType = 'investor_rent' | 'investor_flip' | 'owner' | 'tenant';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: number;
  note?: string;
}

export interface DealInsightsV2 {
  version: 2;
  profileType: ProfileType;

  snapshot: {
    positives: string[];
    negatives: string[];
    primaryReason: string;
  };

  drivers: string[];
  risks: string[];
  opportunities: string[];

  personalFit: {
    [key: string]: string | string[];
  };

  checklist: ChecklistItem[];

  observations: {
    viewingNotes: string[];
    marketSignals: string[];
    freeform?: string;
  };

  finalAssessment: {
    decisionLean: string;
    confidence: number;
    strategyFit: string;
    stressLevel: string;
  };

  notes?: string;

  progress: {
    completionPercent: number;
    status: string;
  };

  lastUpdated: number;
}