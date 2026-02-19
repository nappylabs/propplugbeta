import { DEFAULTS } from '../constants';
import { ProjectInputs } from '../types';

/**
 * Calculates the monthly bond repayment (Principal & Interest).
 * Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
 */
export const calculateMonthlyBond = (loanAmount: number, annualRatePercent: number, termYears: number) => {
  if (loanAmount <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) return loanAmount / numberOfPayments;

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

  return loanAmount * (numerator / denominator);
};

/**
 * Calculates the Transfer Duty (South Africa 2025 rates).
 */
export const calculateTransferDuty = (price: number) => {
  if (price <= 1100000) return 0;
  if (price <= 1512500) return (price - 1100000) * 0.03;
  if (price <= 2117500) return 12375 + (price - 1512500) * 0.06;
  if (price <= 2722500) return 48675 + (price - 2117500) * 0.08;
  if (price <= 12100000) return 97075 + (price - 2722500) * 0.11;
  return 1128600 + (price - 12100000) * 0.13;
};

/**
 * Investor Profile Calculations
 */
export const calculateInvestorMetrics = (inputs: any) => {
  const {
    purchasePrice,
    monthlyRent,
    depositPercent = 0,
    interestRate = DEFAULTS.BOND_INTEREST_RATE,
    termYears = DEFAULTS.BOND_TERM_YEARS,
    levies = 0,
    rates = 0,
    insurance = 0,
    includeMaintenance = true,
    maintenancePercentRent = 5,
    includeVacancy = true,
    vacancyPercent = 0,
    includeManagement = true,
    managementPercent = 0,
  } = inputs;

  const closingCosts = purchasePrice * DEFAULTS.CLOSING_COSTS_PERCENT;
  const depositAmount = purchasePrice * (depositPercent / 100);
  const loanAmount = purchasePrice - depositAmount;
  const totalEquityRequired = depositAmount + closingCosts;

  const bondPayment = calculateMonthlyBond(loanAmount, interestRate, termYears);
  
  const maintenance = includeMaintenance ? monthlyRent * (maintenancePercentRent / 100) : 0;
  const vacancy = includeVacancy ? monthlyRent * (vacancyPercent / 100) : 0;
  const management = includeManagement ? monthlyRent * (managementPercent / 100) : 0;

  const totalMonthlyExpenses = bondPayment + levies + rates + insurance + maintenance + vacancy + management;

  const netCashflow = monthlyRent - totalMonthlyExpenses;
  
  const annualRent = monthlyRent * 12;
  const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;

  return {
    bondPayment,
    closingCosts,
    totalEquityRequired,
    totalMonthlyExpenses,
    netCashflow,
    grossYield,
    breakdown: {
      maintenance,
      vacancy,
      management
    }
  };
};

/**
 * Owner-Occupied Profile Calculations
 */
export const calculateOwnerMetrics = (inputs: any) => {
  const {
    purchasePrice = 0,
    depositPercent = 0,
    interestRate = 0,
    termYears = 0,
    levies = 0,
    rates = 0,
    insurance = 0,
    utilities = 0,
    monthlyIncome = 0,
    maintenancePercentValue = 1, // Default 1% per year of purchase price
    includeMaintenance = true
  } = inputs;

  const depositAmount = purchasePrice * (depositPercent / 100) || 0;
  const loanAmount = purchasePrice - depositAmount || 0;
  const bondPayment = calculateMonthlyBond(loanAmount, interestRate, termYears) || 0;

  // Maintenance for Owner: % of Purchase Price per year, divided by 12 for monthly
  const maintenance = includeMaintenance ? ((purchasePrice * (maintenancePercentValue / 100)) / 12 || 0) : 0;

  const totalHousingCost = (bondPayment + levies + rates + insurance + maintenance) || 0;
  const totalMonthlyOutflow = (totalHousingCost + utilities) || 0;

  let housingCostRatio = 0;
  let disposableAfterHousing = 0;

  if (monthlyIncome > 0) {
    housingCostRatio = (totalHousingCost / monthlyIncome) * 100;
    disposableAfterHousing = monthlyIncome - totalMonthlyOutflow;
  }

  return {
    bondPayment,
    totalHousingCost,
    totalMonthlyOutflow,
    housingCostRatio,
    disposableAfterHousing,
    maintenance
  };
};

/**
 * Tenant Profile Calculations
 */
export const calculateTenantMetrics = (inputs: any) => {
  const {
    monthlyRent,
    monthlyIncome,
    utilities = 0,
    transport = 0,
    groceries = 0,
    otherEssentials = 0
  } = inputs;

  const totalEssentials = utilities + transport + groceries + otherEssentials;
  const totalCostOfLiving = monthlyRent + totalEssentials;

  let rentToIncomeRatio = 0;
  let disposableIncome = 0;

  if (monthlyIncome > 0) {
    rentToIncomeRatio = (monthlyRent / monthlyIncome) * 100;
    disposableIncome = monthlyIncome - totalCostOfLiving;
  }

  return {
    rentToIncomeRatio,
    totalEssentials,
    totalCostOfLiving,
    disposableIncome
  };
};

/**
 * Web App Specific: Property Metrics for Dashboard
 * (Adapted from original engine.ts)
 */
export const calculatePropMetrics = (price: number, rent: number, depositPct: number, rate: number) => {
  const loanAmount = price * (1 - depositPct / 100);
  const monthlyBond = calculateMonthlyBond(loanAmount, rate, 20); // Standard 20yr term for web quick view

  // Web app uses a simplified maintenance assumption (0.5% of value) for the quick view
  const maintenance = (price * 0.005) / 12; 
  const netCashflow = rent - monthlyBond - maintenance;
  const netYield = price > 0 ? ((rent * 12) / price) * 100 : 0;

  return {
    netYield: netYield.toFixed(2),
    monthlyBond: Math.round(monthlyBond),
    netCashflow: Math.round(netCashflow),
    forecast: Array.from({length: 10}, (_, i) => Math.round(netCashflow * 12 * Math.pow(1.06, i)))
  };
};

export const calculateIfOwnedMetrics = (inputs: any) => {
    // Placeholder if needed for future shared logic
    return {};
};