import { calculateInvestorMetrics, calculateOwnerMetrics, calculateTenantMetrics } from '../logic/calculations';

export const formatNumber = (num: number) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const abs = Math.abs(num);
  const isNeg = num < 0;
  let valStr;

  if (abs >= 1000000) {
    let mVal = (abs / 1000000).toFixed(2);
    let parts = mVal.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    valStr = parts.join('.') + 'm';
  } else {
    valStr = abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  return isNeg ? `(${valStr})` : valStr;
};

export const calculateAnalysis = (inputs: any) => {
  // Ensure we have the derived values needed for the shared calculations
  const purchasePrice = inputs.askingPrice * (1 - (inputs.discountOnAsking / 100));
  const fullInputs = { ...inputs, purchasePrice };

  const invMetrics = calculateInvestorMetrics(fullInputs);
  const ownMetrics = calculateOwnerMetrics(fullInputs);
  const tenMetrics = calculateTenantMetrics(fullInputs);

  // --- Forecasts & Projections ---
  const years = 10;
  const inflation = (inputs.inflationRate || 5) / 100;
  const rentEscalation = (inputs.rentEscalationRate || 5) / 100;
  const capitalGrowth = 0.05; // Assumption
  const investmentReturn = 0.08; // Assumption for tenant savings
  
  // 1. Wealth Projection (Investor/Owner)
  const wealthSeries = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    // Simple compound growth for property value
    const propertyValue = purchasePrice * Math.pow(1 + capitalGrowth, year);
    
    // Bond balance amortization (simplified)
    const r = inputs.interestRate / 100 / 12;
    const n = inputs.termYears * 12;
    const monthlyPayment = invMetrics.bondPayment;
    const loanAmount = purchasePrice - invMetrics.totalEquityRequired + invMetrics.closingCosts; // Principal
    
    // Remaining Balance Formula: B = P * ((1+r)^n - (1+r)^p) / ((1+r)^n - 1)
    const p = year * 12;
    const remainingBond = loanAmount > 0 ? (loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, p))) / (Math.pow(1 + r, n) - 1) : 0;
    
    return {
      year: `Year ${year}`,
      equity: Math.round(propertyValue - remainingBond),
      propertyValue: Math.round(propertyValue),
      bond: Math.round(remainingBond)
    };
  });

  // 2. Rent vs Buy Projection
  // We compare Net Wealth of Buying vs Renting & Investing the difference
  let rentWealth = invMetrics.totalEquityRequired; // Start with the deposit + costs you didn't spend
  let buyWealth = invMetrics.totalEquityRequired; // Start with equity (deposit)

  const rentVsBuySeries = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    
    // BUY SCENARIO
    // Asset: Property Value
    const propVal = purchasePrice * Math.pow(1 + capitalGrowth, year);
    // Liability: Bond (using same simplified calc as above)
    const r = inputs.interestRate / 100 / 12;
    const n = inputs.termYears * 12;
    const p = year * 12;
    const loanAmount = purchasePrice - (purchasePrice * (inputs.depositPercent/100));
    const bondBal = loanAmount > 0 ? (loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, p))) / (Math.pow(1 + r, n) - 1) : 0;
    buyWealth = propVal - bondBal;

    // RENT SCENARIO
    // Costs: Rent (escalating)
    const currentMonthlyRent = inputs.monthlyRent * Math.pow(1 + rentEscalation, i);
    // Costs: Buy (Bond + Expenses escalating)
    const currentMonthlyBuyCost = invMetrics.bondPayment + (ownMetrics.totalHousingCost - invMetrics.bondPayment) * Math.pow(1 + inflation, i);
    
    // Difference to invest (if buying is more expensive, we save that amount. If renting is more expensive, we lose that from portfolio)
    const monthlyDifference = currentMonthlyBuyCost - currentMonthlyRent;
    
    // Add annual difference + return on portfolio
    rentWealth = (rentWealth + (monthlyDifference * 12)) * (1 + investmentReturn);

    return {
      year: `Year ${year}`,
      buyWealth: Math.round(buyWealth),
      rentWealth: Math.round(rentWealth)
    };
  });

  return { 
    investor: invMetrics, 
    owner: ownMetrics, 
    tenant: tenMetrics,
    wealthSeries,
    rentVsBuySeries
  };
};