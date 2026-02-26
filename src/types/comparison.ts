import { DealInsightsV2 } from './insights';

export interface ComparisonMetric {
  label: string;
  valueA: number | null;
  valueB: number | null;
  winner: 'A' | 'B' | 'tie';
  format: (value: number | null, currency: string) => string;
}

export interface ComparisonCategory {
  title: string;
  stronger: 'A' | 'B' | 'tie';
  metrics: ComparisonMetric[];
}

export interface KeyDifference {
  text: string;
  icon: 'yield' | 'cashflow' | 'price' | 'risk' | 'insight' | 'cost';
}

export interface GeneratedComparison {
  propertyA: any;
  propertyB: any;
  keyDifferences: KeyDifference[];
  insightSnapshot: {
    A: DealInsightsV2 | null;
    B: DealInsightsV2 | null;
  };
  financials: ComparisonCategory;
  risks: ComparisonCategory;
  outlook: ComparisonCategory;
}