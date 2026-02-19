import { DealInsights } from './insights';

export interface ComparisonMetric {
  label: string;
  valueA: number | string;
  valueB: number | string;
  winner: 'A' | 'B' | 'tie';
  format: (value: number | string, currency: string) => string;
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
    A: DealInsights | null;
    B: DealInsights | null;
  };
  financials: ComparisonCategory;
  risks: ComparisonCategory;
  outlook: ComparisonCategory;
}