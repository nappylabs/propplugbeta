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
      const result = path.split('.').reduce((o: any, p: string) => (o && o.hasOwnProperty(p) ? o[p] : null), obj);
      return result === undefined ? null : result;
  }

  // Calculate analysis and inject raw inputs as numbers for comparison
  const prepareAnalysis = (project: any) => {
      const analysis = calculateAnalysis(project.inputSnapshot);
      ['levies', 'rates', 'vacancyPercent', 'propertyAppreciationRate', 'rentEscalationRate', 'inflationRate'].forEach(key => {
          (analysis as any)[key] = parseFloat(project.inputSnapshot[key]) || 0;
      });
      (analysis as any).total10yCashflow = analysis.rentalSeries.reduce((sum: number, year: any) => sum + year.cashflow, 0);
      (analysis as any).equityY10 = analysis.rentalSeries.length === 10 ? analysis.rentalSeries[9].equity : 0;
      (analysis as any).totalPrincipalPaid = analysis.totalPrincipalPaid || 0;
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
  const getRisks = (insights: any) => {
      if (!insights || insights.version !== 2 || !insights.risks) return [];
      return insights.risks;
  }

  const risksA = getRisks(projectA.inputSnapshot.insights);
  const risksB = getRisks(projectB.inputSnapshot.insights);

  if (risksA.length > 0 && risksB.length === 0) {
      keyDifferences.push({ text: `You noted risks for Property A: "${risksA[0]}"`, icon: 'risk' });
  } else if (risksA.length === 0 && risksB.length > 0) {
      keyDifferences.push({ text: `You noted risks for Property B: "${risksB[0]}"`, icon: 'risk' });
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
        createMetric('Total 10Y Cashflow', 'total10yCashflow', 'high', formatCurrency),
        createMetric('Final Equity (Y10)', 'equityY10', 'high', formatCurrency),
        createMetric('Total Principal Paid (10Y)', 'totalPrincipalPaid', 'high', formatCurrency),
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