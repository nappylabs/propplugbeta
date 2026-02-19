import { GeneratedComparison, KeyDifference, ComparisonMetric } from '@/types/comparison';
import { calculateAnalysis } from './analysis';

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

const THRESHOLDS = {
  yield: 0.5,
  cashflow: 500,
  price: 0.05,
  levies: 0.1,
};

const formatCurrency = (val: number, cs: string) => `${cs} ${Math.round(val).toLocaleString()}`;
const formatPercent = (val: number) => `${val.toFixed(1)}%`;

export const generateComparison = (projectA: any, projectB: any): GeneratedComparison => {
  // Helper to get nested property
  // Defined at the top to ensure it's available for all logic blocks below
  const getNestedValue = (obj: any, path: string) => {
      if (!path) return null;
      // 'hasOwnProperty' check is important for safety.
      const result = path.split('.').reduce((o, p) => (o && o.hasOwnProperty(p) ? o[p] : null), obj);
      return result === undefined ? null : result;
  }

  // Calculate analysis and inject raw inputs as numbers for comparison
  const prepareAnalysis = (project: any) => {
      const analysis = calculateAnalysis(project.inputSnapshot);
      ['levies', 'rates', 'vacancyPercent', 'propertyAppreciationRate', 'rentEscalationRate', 'inflationRate'].forEach(key => {
          (analysis as any)[key] = parseFloat(project.inputSnapshot[key]) || 0;
      });
      return analysis;
  };

  const analysisA = prepareAnalysis(projectA);
  const analysisB = prepareAnalysis(projectB);

  const csA = CURRENCY_SYMBOLS[projectA.inputSnapshot.currency] || 'R';
  const csB = CURRENCY_SYMBOLS[projectB.inputSnapshot.currency] || 'R';

  const profile = projectA.inputSnapshot.type || 'investor';
  const strategy = projectA.inputSnapshot.strategy || 'rental';

  const keyDifferences: KeyDifference[] = [];

  // --- Quantitative Differences ---
  if (profile === 'investor' && strategy === 'rental') {
    // Yield
    const yieldDiff = Math.abs(analysisA.netYield - analysisB.netYield);
    if (yieldDiff >= THRESHOLDS.yield) {
      const winner = analysisA.netYield > analysisB.netYield ? 'A' : 'B';
      keyDifferences.push({
        text: `Property ${winner} has a ${yieldDiff.toFixed(1)}% higher Net Yield`,
        icon: 'yield',
      });
    }

    // Cashflow
    const cashflowDiff = Math.abs(analysisA.netCashflow - analysisB.netCashflow);
    if (cashflowDiff >= THRESHOLDS.cashflow) {
      const winner = analysisA.netCashflow > analysisB.netCashflow ? 'A' : 'B';
      const currency = winner === 'A' ? csA : csB;
      keyDifferences.push({
        text: `Property ${winner} has ~${formatCurrency(cashflowDiff, currency)} higher monthly cashflow`,
        icon: 'cashflow',
      });
    }
  } else if (profile === 'investor' && strategy === 'flip') {
    // Profit Difference for Flips
    const profitA = getNestedValue(analysisA, 'flip.series.6.profit') || 0;
    const profitB = getNestedValue(analysisB, 'flip.series.6.profit') || 0;
    const profitDiff = Math.abs(profitA - profitB);
    if (profitDiff > (analysisA.purchasePrice * 0.02)) { // e.g., if difference is more than 2% of purchase price
        const winner = profitA > profitB ? 'A' : 'B';
        const currency = winner === 'A' ? csA : csB;
        keyDifferences.push({
            text: `Property ${winner} has ~${formatCurrency(profitDiff, currency)} higher profit potential`,
            icon: 'yield', // Using yield icon for profit
        });
    }
  }

  // Price (Common to all)
  const priceDiff = Math.abs(analysisA.purchasePrice - analysisB.purchasePrice);
  if (priceDiff / analysisA.purchasePrice >= THRESHOLDS.price) {
    const cheaper = analysisA.purchasePrice < analysisB.purchasePrice ? 'A' : 'B';
    const currency = cheaper === 'A' ? csA : csB;
    keyDifferences.push({
      text: `Property ${cheaper} is ~${formatCurrency(priceDiff, currency)} cheaper`,
      icon: 'price',
    });
  }
  
  // Levies (Common to all)
  const leviesA = parseFloat(projectA.inputSnapshot.levies) || 0;
  const leviesB = parseFloat(projectB.inputSnapshot.levies) || 0;
  const leviesDiff = Math.abs(leviesA - leviesB);
  if (leviesA > 0 && leviesDiff / leviesA >= THRESHOLDS.levies) {
      const lower = leviesA < leviesB ? 'A' : 'B';
      const currency = lower === 'A' ? csA : csB;
      keyDifferences.push({
          text: `Property ${lower} has ~${formatCurrency(leviesDiff, currency)} lower monthly levies`,
          icon: 'cost'
      });
  }


  // --- Qualitative Differences ---
  const getTopInsight = (insights: any, category: string) => {
      if (!insights) return null;
      const riskPrompt = Object.values(insights.prompts).find((p: any) => p.category === category && p.completedAt);
      return riskPrompt ? (riskPrompt as any).response : null;
  }

  const riskA = getTopInsight(projectA.inputSnapshot.insights, 'risks');
  const riskB = getTopInsight(projectB.inputSnapshot.insights, 'risks');
  if (riskA && !riskB) {
      keyDifferences.push({ text: `You noted a risk for Property A: "${riskA}"`, icon: 'risk' });
  }
  if (!riskA && riskB) {
      keyDifferences.push({ text: `You noted a risk for Property B: "${riskB}"`, icon: 'risk' });
  }

  // --- Metric Definitions ---
  const createMetric = (label: string, analysisKey: string, direction: 'high' | 'low', formatter: (val: number, cs: string) => string): ComparisonMetric => {
    const valA = getNestedValue(analysisA, analysisKey);
    const valB = getNestedValue(analysisB, analysisKey);
    let winner: 'A' | 'B' | 'tie' = 'tie';

    const numA = typeof valA === 'number' ? valA : null;
    const numB = typeof valB === 'number' ? valB : null;

    if (numA !== null && numB !== null) {
        if (direction === 'high') {
            if (numA > numB) winner = 'A';
            if (numB > numA) winner = 'B';
        } else { // 'low' direction
            if (numA < numB) winner = 'A';
            if (numB < numA) winner = 'B';
        }
    }

    return {
      label,
      valueA: valA,
      valueB: valB,
      winner,
      format: (val, cs) => (val !== null && typeof val === 'number') ? formatter(val, cs) : '-',
    };
  };

  const getFinancialMetrics = () => {
      const profile = projectA.inputSnapshot.type || 'investor';
      const strategy = projectA.inputSnapshot.strategy || 'rental';

      if (profile === 'investor' && strategy === 'rental') {
          return [
              createMetric('Net Yield', 'netYield', 'high', (v, cs) => formatPercent(v)),
              createMetric('Cash on Cash', 'cashOnCashReturn', 'high', (v, cs) => formatPercent(v)),
              createMetric('Monthly Cashflow', 'netCashflow', 'high', formatCurrency),
              createMetric('Purchase Price', 'purchasePrice', 'low', formatCurrency),
          ];
      }
      if (profile === 'investor' && strategy === 'flip') {
          return [
              createMetric('Velocity ROI', 'flip.velocityROI', 'high', (v, cs) => formatPercent(v)),
              createMetric('Total Profit', 'flip.series.6.profit', 'high', formatCurrency),
              createMetric('Total Cash Required', 'flip.totalCashRequired', 'low', formatCurrency),
          ];
      }
      if (profile === 'owner') {
          return [
              createMetric('Total Monthly Cost', 'owner.totalCosts', 'low', formatCurrency),
              createMetric('Affordability Ratio', 'owner.incomeRatio', 'low', (v, cs) => formatPercent(v)),
              createMetric('Interest Rate Shield', 'owner.maxRate', 'high', (v, cs) => formatPercent(v)),
          ];
      }
      if (profile === 'tenant') {
          return [
              createMetric('Monthly Rent', 'tenant.monthlyRent', 'low', formatCurrency),
              createMetric('Disposable Income', 'tenant.disposableIncome', 'high', formatCurrency),
              createMetric('Rent to Income', 'tenant.rentToIncomeRatio', 'low', (v, cs) => formatPercent(v)),
          ];
      }
      return [];
  }

  const getRiskMetrics = () => {
      const metrics = [
          createMetric('Levies', 'levies', 'low', formatCurrency),
          createMetric('Rates & Taxes', 'rates', 'low', formatCurrency),
      ];
      if (profile === 'investor') {
          metrics.push(createMetric('Vacancy Provision', 'vacancyPercent', 'low', (v, cs) => formatPercent(v)));
      }
      return metrics;
  };

  const getOutlookMetrics = () => {
      return [
          createMetric('Capital Growth', 'propertyAppreciationRate', 'high', (v, cs) => formatPercent(v)),
          createMetric('Rental Escalation', 'rentEscalationRate', 'high', (v, cs) => formatPercent(v)),
          createMetric('Inflation Assumption', 'inflationRate', 'low', (v, cs) => formatPercent(v)),
      ];
  };

  const financialMetrics = getFinancialMetrics();
  const riskMetrics = getRiskMetrics();
  const outlookMetrics = getOutlookMetrics();

  const getCategoryWinner = (metrics: ComparisonMetric[]): 'A' | 'B' | 'tie' => {
      const winsA = metrics.filter(m => m.winner === 'A').length;
      const winsB = metrics.filter(m => m.winner === 'B').length;
      if (winsA > winsB) return 'A';
      if (winsB > winsA) return 'B';
      return 'tie';
  }

  return {
    propertyA: projectA,
    propertyB: projectB,
    keyDifferences,
    insightSnapshot: {
      A: projectA.inputSnapshot.insights || null,
      B: projectB.inputSnapshot.insights || null,
    },
    financials: {
      title: 'Financial Performance',
      metrics: financialMetrics,
      stronger: getCategoryWinner(financialMetrics),
    },
    risks: {
        title: 'Risk Exposure',
        metrics: riskMetrics,
        stronger: getCategoryWinner(riskMetrics),
    },
    outlook: {
        title: 'Long-Term Outlook',
        metrics: outlookMetrics,
        stronger: getCategoryWinner(outlookMetrics),
    }
  };
};